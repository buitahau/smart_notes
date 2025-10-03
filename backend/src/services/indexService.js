import {
  createIndex as createIndexFunction,
  createMetadataIndex as createMetadataIndexFunction,
  deleteIndex as deleteIndexFunction,
  listMetadataIndex as listMetadataIndexFunction,
} from '../ai/services/indexes.js';

const createContext = (reqBody = {}) => {
  return {
    env: {
      CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
      CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    },
    req: {
      json: async () => reqBody,
    },
    json: data => data,
  };
};

class IndexService {

  validateAndExtractResult(result, operation) {
    if (!result) {
      throw new Error(`Failed to ${operation}`);
    }

    if (result.error) {
      throw new Error(result.error);
    }

    return result.result;
  }

  async createIndex() {
    try {
      const context = createContext();
      const result = await createIndexFunction(context);
      return this.validateAndExtractResult(result, 'create index');
    } catch (error) {
      console.error('Error creating index:', error);
      throw error;
    }
  }

  async createMetadataIndex() {
    try {
      const context = createContext();
      const result = await createMetadataIndexFunction(context);
      return this.validateAndExtractResult(result, 'create metadata index');
    } catch (error) {
      console.error('Error creating metadata index:', error);
      throw error;
    }
  }

  async deleteIndex(indexName) {
    try {
      if (!indexName) {
        throw new Error('Index name is required');
      }

      const context = createContext({ index_name: indexName });
      const result = await deleteIndexFunction(context);
      return this.validateAndExtractResult(result, 'delete index');
    } catch (error) {
      console.error('Error deleting index:', error);
      throw error;
    }
  }

  async listMetadataIndex() {
    try {
      const context = createContext();
      const result = await listMetadataIndexFunction(context);
      return this.validateAndExtractResult(result, 'retrieve metadata indexes');
    } catch (error) {
      console.error('Error listing metadata indexes:', error);
      throw error;
    }
  }
}

export default new IndexService();