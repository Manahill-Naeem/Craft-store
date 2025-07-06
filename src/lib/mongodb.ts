// lib/mongodb.ts
import { MongoClient, Db } from 'mongodb';

// Declare global variables provided by the Canvas environment
declare const __app_id: string | undefined; // We'll use this to scope collections if needed

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// In production, we recommend not using a global variable for the client
// because it can lead to memory leaks and connection issues.
// However, for development, a global variable is fine.
if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the client
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient object. By doing this in a
// separate module, the client can be shared across functions.
export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  // Use the __app_id to create a unique database name for this Canvas app
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  const dbName = `my_store_db_${appId}`; // Unique database name per Canvas app

  return client.db(dbName);
}

export default clientPromise;
