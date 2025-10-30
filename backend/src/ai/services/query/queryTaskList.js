import { getVectorizeIndexUrl } from '../../utils/vectorize.js';
import { apiClient } from '../fetch.js';
import AdapterFactory from '../../adapters/adapterFactory.js';
import { createEmbedding } from '../../utils/createEmbedding.js';

const extractDatesFromQuery = async (c, query) => {
  const queryAdapter = AdapterFactory.getQueryAdapter();
  return await queryAdapter.extractDatesFromQuery(query);
};

export const queryTaskList = async c => {
  const { userId, query } = await c.req.json();
  if (!userId) {
    return c.json({ error: 'Missing userId' }, 400);
  }

  // Extract dates from query
  const dateFilter = await extractDatesFromQuery(c, query);
  console.log('Extracted date filter:', dateFilter);

  const embeddingVector = await createEmbedding(c, query);

  const data = await apiClient.post(c, `${getVectorizeIndexUrl(c)}/query`, {
    vector: embeddingVector,
    topK: 10,
    returnMetadata: 'all',
    returnValues: false,
    filter: {
      userId,
      dateAt: dateFilter,
    },
  });

  const noteIds = (data.result?.matches || []).map(m => m.metadata.noteId);
  console.log(noteIds)
  return noteIds;
};
