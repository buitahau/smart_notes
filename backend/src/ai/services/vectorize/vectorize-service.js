import CloudFlareVectorizeService from "./cloud-flare/cloud-flare-vectorize-service.js";

const cloudFlareVectorizeService = new CloudFlareVectorizeService();

export const createIndex = async () => {
  return cloudFlareVectorizeService.createIndex();
};

export const createMetadataIndex = async () => {
  return cloudFlareVectorizeService.createMetadataIndex();
};

export const deleteIndex = async indexName => {
  return cloudFlareVectorizeService.deleteIndex(indexName);
};

export const listMetadataIndex = async () => {
  return cloudFlareVectorizeService.listMetadataIndex();
};
