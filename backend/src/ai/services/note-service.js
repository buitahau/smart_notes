import { getVectorizeIndexUrl } from './vectorize/cloud-flare/helper/vectorize-helper.js';
import { convertDateToTimestamp } from '../utils/date.js';
import { apiClient } from './vectorize/cloud-flare/helper/fetch.js';
import { createEmbedding } from './embedding-service.js';

export const insertNote = async c => {
  const { noteId, content, userId, dateAt } = await c.req.json();
  if (!noteId || !userId || !content || !dateAt) {
    return c.json(
      { error: 'Missing fields: noteId, content, userId, dateAt' },
      400
    );
  }
  const dateAtTimestmp = convertDateToTimestamp(dateAt);

  const embedding = await createEmbedding(content);

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
      dateAt: convertDateToTimestamp(dateAt),
    },
  };

  payload.values = await createEmbedding(content);

  // Use upsert so the vector is created when missing and updated otherwise
  const result = await apiClient.postNdjson(
    c,
    `${getVectorizeIndexUrl(c)}/upsert`,
    payload
  );

  return c.json(result);
};


export const deleteNote = async c => {
  const { noteId } = await c.req.json();

  if (!noteId) {
    return c.json({ error: 'Missing fields: noteId is required' }, 400);
  }

  const result = await apiClient.post(
    c,
    `${getVectorizeIndexUrl(c)}/delete_by_ids`,
    {
      ids: [noteId],
    }
  );

  return c.json(result);
};
