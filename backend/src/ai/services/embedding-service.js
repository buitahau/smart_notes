import AdapterFactory from "../adapters/adapterFactory.js";
import ProviderEnum from "../adapters/ProviderEnum.js";

export const createEmbedding = async (input) => {
  const queryAdapter = AdapterFactory.getQueryAdapter(ProviderEnum.OPEN_AI);
  return queryAdapter.createEmbedding(input);
};