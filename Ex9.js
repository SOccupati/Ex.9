const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'bookstore';

// Helper function to connect to MongoDB
const connectToMongoDB = async () => {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db(dbName);
  return { client, db };
};

// 9-1. Insert a single document into the "books" collection
const insertSingleDocument = async (doc) => {
  const { client, db } = await connectToMongoDB();
  const result = await db.collection('books').insertOne(doc);
  client.close();
  return result.ops[0];
};

// 9-2. Insert an array of documents into the "books" collection
const insertManyDocuments = async (docs) => {
  const { client, db } = await connectToMongoDB();
  const result = await db.collection('books').insertMany(docs);
  client.close();
  return result.ops;
};

// 9-3. Retrieve documents sorted by a field
const getSortedDocuments = async (field, ascending) => {
  const { client, db } = await connectToMongoDB();
  const sortOrder = ascending ? 1 : -1;
  const documents = await db
    .collection('books')
    .find()
    .sort({ [field]: sortOrder })
    .toArray();
  client.close();
  return documents;
};

// 9-4. Retrieve the oldest document based on the "published" field
const getOldestDocument = async () => {
  const { client, db } = await connectToMongoDB();
  const document = await db
    .collection('books')
    .find()
    .sort({ published: 1 })
    .limit(1)
    .toArray();
  client.close();
  return document[0];
};

// 9-5. Retrieve documents with titles matching a partial string
const getDocumentsByTitleQuery = async (titleQuery) => {
  const { client, db } = await connectToMongoDB();
  const regex = new RegExp(titleQuery, 'i');
  const documents = await db
    .collection('books')
    .find({ title: { $regex: regex } })
    .toArray();
  client.close();
  return documents;
};

module.exports = {
  insertSingleDocument,
  insertManyDocuments,
  getSortedDocuments,
  getOldestDocument,
  getDocumentsByTitleQuery,
};
