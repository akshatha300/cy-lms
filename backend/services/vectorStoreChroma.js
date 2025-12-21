import { ChromaClient } from "chromadb";

// Basic RAG-related config with sensible defaults.
const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";
const CHROMA_COLLECTION = process.env.CHROMA_COLLECTION || "lms_content";

let client = null;
let collectionPromise = null;

const getClient = () => {
  if (!client) {
    client = new ChromaClient({ path: CHROMA_URL });
  }
  return client;
};

const getCollection = async () => {
  if (!collectionPromise) {
    const c = getClient();
    collectionPromise = c.getOrCreateCollection({
      name: CHROMA_COLLECTION,
    });
  }
  return collectionPromise;
};

/**
 * Upsert a batch of documents into Chroma.
 * docs: { ids: string[], documents: string[], metadatas: object[], embeddings?: number[][] }
 */
export const upsertDocuments = async ({ ids, documents, metadatas, embeddings }) => {
  const collection = await getCollection();

  const payload = {
    ids,
    documents,
    metadatas,
  };

  if (embeddings && embeddings.length) {
    payload.embeddings = embeddings;
  }

  await collection.upsert(payload);
};

/**
 * Query the collection with a query embedding and optional filters.
 * Returns a normalized list of { document, metadata, distance }.
 */
export const queryDocuments = async ({
  queryEmbedding,
  topK = 5,
  filters = {},
}) => {
  const collection = await getCollection();

  const response = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK,
    where: Object.keys(filters).length ? filters : undefined,
  });

  const docs = response.documents?.[0] || [];
  const metadatas = response.metadatas?.[0] || [];
  const distances = response.distances?.[0] || [];

  return docs.map((doc, idx) => ({
    document: doc,
    metadata: metadatas[idx] || {},
    distance: typeof distances[idx] === "number" ? distances[idx] : null,
  }));
};

