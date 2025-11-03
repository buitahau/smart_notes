import { getVectorizeIndexUrl } from '../utils/vectorize.js';
import { apiClient } from './fetch.js';

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
