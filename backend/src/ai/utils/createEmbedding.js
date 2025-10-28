export const createEmbedding = async (c, input) => {
  const { OPENAI_API_KEY, OPENAI_EMBEDDING_MODEL } = c.env;

  if (!OPENAI_API_KEY || !OPENAI_EMBEDDING_MODEL) {
    throw new Error('OpenAI embedding configuration is missing');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      input,
      model: OPENAI_EMBEDDING_MODEL,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
        `OpenAI embeddings request failed: ${response.status}`
    );
  }

  const embedding = data?.data?.[0]?.embedding;

  if (!Array.isArray(embedding)) {
    throw new Error('OpenAI embeddings response is missing embedding data');
  }

  return embedding;
};
