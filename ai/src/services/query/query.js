import { ANALYSIS_MODEL, EMBEDDING_MODEL } from '../../constants/config.js';
import { apiClient } from '../fetch.js';

export const classifyQuery = async c => {
  const { query } = await c.req.json();
  const prompt = `
  Given a natural language query, classify the user query into one of :
  - "task_list": user wants tasks for specific time like today/tomorrow/next week ... (date range).
  - "date_lookup": user wants to know when a specific task/note happends.

  Return JSON: {"intent" : "task_list | date_lookup"}.

  Only reply with valid JSON.

  Query: ${query}
  `;

  const result = await c.env.AI.run(ANALYSIS_MODEL, {
    messages: [{ role: 'user', content: prompt }],
  });

  console.log(result);
  let intent = 'unknown';
  let response = result.response;
  try {
    intent = JSON.parse(response).intent;
  } catch (e) {
    console.error('Parse error:', e, response);
  }

  return c.json({ intent });
};

export const queryDateLookup = async c => {
  // TODO
};

export const queryNotes = async c => {
  const { userId, query } = await c.req.json();
  if (!userId) {
    return c.json({ error: 'Missing userId' }, 400);
  }

  const searchText = query;
  const embedding = await c.env.AI.run(EMBEDDING_MODEL, { text: searchText });

  const data = await apiClient.post(
    c,
    `https://api.cloudflare.com/client/v4/accounts/${c.env.CLOUDFLARE_ACCOUNT_ID}/vectorize/indexes/${INDEX_NAME}/query`,
    {
      vector: embedding.data[0],
      topK: 10,
      returnMetadata: true,
      filter: { userId },
    }
  );

  const noteIds = (data.result?.matches || []).map(m => m.metadata.noteId);

  return c.json(noteIds);
};
