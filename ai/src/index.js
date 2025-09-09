import {Hono} from "hono";
const app = new Hono()
const INDEX_NAME = "notes-index-7";
const EMBEDDING_MODEL = "@cf/baai/bge-base-en-v1.5";

app.get('/ping', (c) => c.json({message: 'pong'}))

function getBaseVectorizeUrl(c) {
  return `https://api.cloudflare.com/client/v4/accounts/${c.env.CLOUDFLARE_ACCOUNT_ID}/vectorize/v2/indexes/`;
}

function getVectorizeUrl(c) {
  return getBaseVectorizeUrl(c) + `${INDEX_NAME}`;
}

app.post('/get-embeddings', async (c) => {
    const { text } = await c.req.json()
    const output = await getEmbeddings(c.env, text);
    return c.json(output);
})

app.post('/create-metadata-index', async (c) => {
  const {propertyName, indexType} =  await c.req.json();
  const payload = {
    indexType,
    propertyName
  };
  console.log(payload)
  const res = await fetch(getVectorizeUrl(c) + '/metadata_index/create',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${c.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )
  console.log(res)
  return c.json(await res.json())
})

app.post("/delete-index", async (c) => {
  const { index_name } = await c.req.json();
  const res = await fetch(getBaseVectorizeUrl(c) + '/' + index_name,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${c.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          }
        }
      )
  return c.json(await res.json())
})

app.post("/classify", async (c) => {
  const { query } = await c.req.json();
  const prompt = `
  Given a natural language query, classify the user query into one of :
  - "task_list": user wants tasks for specific time like today/tomorrow/next week ... (date range).
  - "date_lookup": user wants to know when a specific task/note happends.

  Return JSON: {"intent" : "task_list | date_lookup"}.

  Only reply with valid JSON.

  Query: ${query}
  `;

  const result = await c.env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
    messages: [{ role: "user", content: prompt }],
  });

  console.log(result)
  let intent = "unknown";
  let response = result.response;
  try {
    intent = JSON.parse(response).intent;
  } catch (e) {
    console.error("Parse error:", e, response);
  }

  return c.json({ intent });
});

app.post("/create-index", async (c) => {
    const res = await fetch(getBaseVectorizeUrl(c),
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${c.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: INDEX_NAME,
            config: {
              dimensions: 768,
              metric: 'cosine'
            }
          }),
        }
      )
      return c.json(await res.json())
})

app.post('/insert', async (c) => {
    const {noteId, content, userId, dateAt} = await c.req.json();
    if (!noteId || !userId || !content || !dateAt) {
        return c.json({ error: 'Missing fields: noteId, content, userId, dateAt' }, 400)
    }
    const dateAtTimestmp = "" + Math.floor(new Date(dateAt).getTime() / 1000);
    console.log("dateAtTimestmp: ", dateAtTimestmp)
    const usermetadata = {noteId, userId, dateAt: dateAtTimestmp};
    console.log("usermetadata: ", usermetadata)

    // Create embedding from content + dateAt
    const embeddingInput = `${content}`;
    const embedding = await c.env.AI.run(EMBEDDING_MODEL, { text: embeddingInput })
    // const embedding = await getEmbeddings(c.env, embeddingInput);

    // Insert vector with noteId + userId metadata
    const vector = {
        id: noteId,
        values: embedding.data[0],
        metadata: {noteId, userId, dateAt: dateAtTimestmp}
    }
    const res = await fetch(`${getVectorizeUrl(c)}/insert`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${c.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/x-ndjson',
          },
          body: JSON.stringify(vector),
        }
      )
      return c.json(await res.json())
})

app.post("/query/task_list", async (c) => {
  const { userId, query } = await c.req.json();
  console.log("query/task_list: " + userId  +"/" + query)
  if (!userId) {
    return c.json({ error: 'Missing userId' }, 400)
  }
  /*

  const today = new Date().toISOString().slice(0, 10);

  const promptDate = `
  You are a date parser. Convert the user query into JSON with fields:
  { "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD" }.

  Today is ${today}.
  If the query refers to "today", "tomorrow", "next week", etc., resolve to exact dates.
  Only reply with valid JSON.

  Query: "${query}
  `;

  const resultDate = await c.env.AI.run('@cf/meta/llama-2-7b-chat-fp16', {
    messages: [{ role: 'user', content: promptDate }],
  })

  console.log("resultDate", resultDate)

  let dateRange = {};
  try {
    dateRange = JSON.parse(resultDate.response)
  } catch {
    dateRange = { startDate: today, endDate: today };
  }
  console.log("dateRange", dateRange)
  */
  
  const embeddingQuery = await c.env.AI.run(EMBEDDING_MODEL, { text: query })
  console.log(embeddingQuery)
  const dateAtTimestmp = "" + Math.floor(new Date("2025-09-16").getTime() / 1000);
  const res = await fetch(`${getVectorizeUrl(c)}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${c.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vector: embeddingQuery.data[0],
        topK: 10,
        returnMetadata: 'all',
        returnValues: true,
        filter: {userId,
          dateAt: {
            "$eq": dateAtTimestmp
          }
        }
      }),
    }
  )

  console.log("response", res)

  const data = await res.json()
  const noteIds = (data.result?.matches || []).map((m) => m.metadata.noteId)

  return c.json(noteIds)
  // return c.json(data.result)
})

app.post("/query", async (c) => {
    const { userId, query } = await c.req.json();
    if (!userId) {
        return c.json({ error: 'Missing userId' }, 400)
    }

    const searchText = query;
    const embedding = await c.env.AI.run(EMBEDDING_MODEL, { text: searchText })

    const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${c.env.CLOUDFLARE_ACCOUNT_ID}/vectorize/indexes/${INDEX_NAME}/query`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${c.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vector: embedding.data[0],
            topK: 10,
            returnMetadata: true,
            filter: { userId }, // ✅ only return this user’s tasks
          }),
        }
      )
    
      const data = await res.json()
      const noteIds = (data.result?.matches || []).map((m) => m.metadata.noteId)
    
      return c.json(noteIds)
})

async function getEmbeddings(env, text) {
    /*
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/baai/bge-base-en-v1.5`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        }
    )
    const data = await res.json()
    return data;
    */

    return await env.AI.run(EMBEDDING_MODEL, { text });
}

export default app
