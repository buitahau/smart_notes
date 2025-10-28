import { getVectorizeIndexUrl } from '../utils/vectorize.js';
import { convertDateToTimestamp } from '../utils/date.js';
import { apiClient } from './fetch.js';
import { createEmbedding } from '../utils/createEmbedding.js';

export const insertNote = async c => {
  const { noteId, content, userId, dateAt } = await c.req.json();
  if (!noteId || !userId || !content || !dateAt) {
    return c.json(
      { error: 'Missing fields: noteId, content, userId, dateAt' },
      400
    );
  }
  const dateAtTimestmp = convertDateToTimestamp(dateAt);
  const usermetadata = { noteId, userId, dateAt: dateAtTimestmp };
  console.log('usermetadata: ', usermetadata);

  // Create embedding from content + dateAt
  const embeddingInput = `${content}`;
  const embedding = await createEmbedding(c, embeddingInput);

  // Insert vector with noteId + userId metadata
  const vector = {
    id: noteId,
    values: embedding,
    metadata: { noteId, userId, dateAt: dateAtTimestmp },
  };
  const result = await apiClient.postNdjson(
    c,
    `${getVectorizeIndexUrl(c)}/insert`,
    vector
  );
  return c.json(result);
};
