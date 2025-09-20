import { INDEX_NAME } from '../constants/config.js';
import {
  getVectorizeIndexUrl,
  getVectorizeBaseUrl,
} from '../utils/vectorize.js';
import { apiClient } from './fetch.js';

export const createIndex = async c => {
  const result = await apiClient.post(c, getVectorizeBaseUrl(c), {
    name: INDEX_NAME,
    config: {
      dimensions: 768,
      metric: 'cosine',
    },
  });
  return c.json(result);
};

export const createMetadataIndex = async c => {
  const { propertyName, indexType } = await c.req.json();
  const payload = {
    indexType,
    propertyName,
  };
  console.log(payload);
  const result = await apiClient.post(
    c,
    getVectorizeIndexUrl(c) + '/metadata_index/create',
    payload
  );
  console.log(result);
  return c.json(result);
};

export const deleteIndex = async c => {
  const { index_name } = await c.req.json();
  const result = await apiClient.delete(
    c,
    getVectorizeBaseUrl(c) + '/' + index_name
  );
  return c.json(result);
};
