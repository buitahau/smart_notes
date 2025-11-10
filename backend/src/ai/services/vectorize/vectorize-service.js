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

export const insertVector = async (noteId, userId, dateAtTimestamp, values) => {
  return cloudFlareVectorizeService.insertVector(
    noteId,
    userId,
    dateAtTimestamp,
    values
  );
};

export const upsertVector = async (noteId, userId, dateAtTimestamp, values) => {
  return cloudFlareVectorizeService.upsertVector(
    noteId,
    userId,
    dateAtTimestamp,
    values
  );
};

export const deleteVectorById = async noteId => {
  return cloudFlareVectorizeService.deleteVectorById(noteId);
};
