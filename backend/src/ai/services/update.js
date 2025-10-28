import { getVectorizeIndexUrl } from '../utils/vectorize.js';
import { convertDateToTimestamp } from '../utils/date.js';
import { apiClient } from './fetch.js';
import { createEmbedding } from '../utils/createEmbedding.js';

export const updateNote = async c => {
  const { noteId, content, userId, dateAt } = await c.req.json();

  if (!noteId || !userId) {
    return c.json(
      { error: 'Missing fields: noteId and userId are required' },
      400
    );
  }

  const payload = {
    id: noteId,
    metadata: {
      noteId,
      userId,
    },
  };

  if (dateAt) {
    payload.metadata.dateAt = convertDateToTimestamp(dateAt);
  }

  if (content) {
    payload.values = await createEmbedding(c, content);
  }

  // Use upsert so the vector is created when missing and updated otherwise
  const result = await apiClient.postNdjson(
    c,
    `${getVectorizeIndexUrl(c)}/upsert`,
    payload
  );

  return c.json(result);
};
