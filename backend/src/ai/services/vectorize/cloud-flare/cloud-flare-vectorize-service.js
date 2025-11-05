import { INDEX_NAME, DIMENSIONS } from "./config.js";
import { apiClient } from "./helper/fetch.js";
import {
  getVectorizeBaseUrl,
  getVectorizeIndexUrl,
} from "./helper/vectorize-helper.js";

class CloudFlareVectorizeService {
  constructor() {
    this.context = this.createContext();
  }

  createContext = () => {
    return {
      env: {
        CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
        CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
      },
    };
  };

  async createIndex() {
    return apiClient.post(
      this.context,
      getVectorizeBaseUrl(this.context),
      {
        name: INDEX_NAME,
        config: {
          dimensions: DIMENSIONS,
          metric: "cosine",
        },
      }
    );
  }

  async createMetadataIndex() {
    const metadataFields = [
      {
        indexType: "string",
        propertyName: "noteId",
      },
      {
        indexType: "string",
        propertyName: "userId",
      },
      {
        indexType: "string",
        propertyName: "dateAt",
      },
    ];

    const metadataUrl = `${getVectorizeIndexUrl(
      this.context
    )}/metadata_index/create`;

    for (const field of metadataFields) {
      const { propertyName, indexType } = field;
      const payload = {
        indexType,
        propertyName,
      };

      await apiClient.post(this.context, metadataUrl, payload);
    }

    return { success: true };
  }

  async deleteIndex(indexName) {
    if (!indexName) {
      throw new Error("Index name is required");
    }

    return apiClient.delete(
      this.context,
      `${getVectorizeBaseUrl(this.context)}${indexName}`
    );
  }

  async listMetadataIndex() {
    return apiClient.get(
      this.context,
      `${getVectorizeIndexUrl(this.context)}/metadata_index/list`
    );
  }
}

export default CloudFlareVectorizeService;
