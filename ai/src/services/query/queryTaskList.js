import { ANALYSIS_MODEL, EMBEDDING_MODEL } from '../../constants/config.js';
import { getVectorizeIndexUrl } from '../../utils/vectorize.js';
import { convertDateToTimestamp } from '../../utils/date.js';
import { apiClient } from '../fetch.js';

const extractDatesFromQuery = async (c, query) => {
  const datePrompt = `
  You are a date parser.
  Extract "fromDate" and "endDate" from the user's query.

  The JSON must follow this format:
  {"fromDate": "<YYYY-MM-DD>", "endDate": "<YYYY-MM-DD or null>"}

  Return ONLY a JSON object, nothing else. No text, no explanation.
  Rules:
  - Always return valid JSON.
  - If only "fromDate" is detected, set "endDate" to null.
  - Dates must be in ISO format (YYYY-MM-DD).
  - Do not include extra text, only return the JSON object.

  Examples: Today is 2025-09-25.

  User: "my task today"
  Output: {"fromDate": "2025-09-25", "endDate": null}

  User: "give me tasks on weekend"
  Output: {"fromDate": "2025-09-27", "endDate": "2025-09-28"}

  Now parse the following query:

  "${query}"
  `;

  const result = await c.env.AI.run(ANALYSIS_MODEL, {
    messages: [{ role: 'user', content: datePrompt }],
  });

  try {
    const { fromDate, endDate } = JSON.parse(result.response);

    if (fromDate && endDate) {
      return {
        $gte: convertDateToTimestamp(fromDate),
        $lte: convertDateToTimestamp(endDate),
      };
    }

    return { $eq: convertDateToTimestamp(fromDate) };
  } catch (e) {
    console.error('Error parsing date extraction:', e);
    return { $exists: true };
  }
};

export const queryTaskList = async c => {
  const { userId, query } = await c.req.json();
  console.log('query/task_list: ' + userId + '/' + query);
  if (!userId) {
    return c.json({ error: 'Missing userId' }, 400);
  }

  // Extract dates from query
  const dateFilter = await extractDatesFromQuery(c, query);
  console.log('Extracted date filter:', dateFilter);

  const embeddingQuery = await c.env.AI.run(EMBEDDING_MODEL, { text: query });

  const data = await apiClient.post(c, `${getVectorizeIndexUrl(c)}/query`, {
    vector: embeddingQuery.data[0],
    topK: 10,
    returnMetadata: 'all',
    returnValues: true,
    filter: {
      userId,
      dateAt: dateFilter,
    },
  });

  const noteIds = (data.result?.matches || []).map(m => m.metadata.noteId);

  console.log(noteIds);
  return c.json(noteIds);
};
