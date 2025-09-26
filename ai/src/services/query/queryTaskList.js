import { ANALYSIS_MODEL, EMBEDDING_MODEL } from '../../constants/config.js';
import { getVectorizeIndexUrl } from '../../utils/vectorize.js';
import { convertDateToTimestamp } from '../../utils/date.js';
import { apiClient } from '../fetch.js';

const extractDatesFromQuery = async (c, query) => {
  const today = new Date().toISOString().split("T")[0];
  const datePrompt = `
  You are a date parser. Today is ${today}
  Extract "fromDate" and "endDate" from the user's query.

  The JSON must follow this format:
  {"fromDate": "<YYYY-MM-DD>", "endDate": "<YYYY-MM-DD or null>"}

  Return ONLY a JSON object, nothing else. No text, no explanation.
  Rules:
  - Always return valid JSON.
  - "fromDate" and "endDate" must be calculated based on the ACTUAL current date when this prompt is executed — NOT based on any examples below.
  - If only "fromDate" is detected, set "endDate" to null.
  - Dates must be in ISO format (YYYY-MM-DD).
  - Correct common typos and misspellings in date words.
  - Do not include extra text, only return the JSON object.

  Examples (structure only — dates will depend on the real current date):
  User: "my task today"
  Output: {"fromDate": "<today>", "endDate": null}

  User: "give me tasks on weekend"
  Output: {"fromDate": "<Saturday>", "endDate": "<Sunday>"}

  Now parse the following query:

  "${query}"
  `;

  const result = await c.env.AI.run(ANALYSIS_MODEL, {
    messages: [{ role: 'user', content: datePrompt }],
  });

  console.log("query: " + query)
  console.log(result.response)
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

  return c.json(noteIds);
};
