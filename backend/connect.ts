const { MongoClient, ServerApiVersion, Db } = require("mongodb");
require("dotenv").config({path: "./config.env"}); //config dotenv file path

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.ATLAS_URI as string, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let database: typeof Db;

module.exports = {
  connectToServer: async ():Promise<void> => {
    try {
      await client.connect();
      database = client.db("FlowerFoxDB");
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Connection failed:", error);
      throw error;
    }
  },
  getDb: (): typeof Db => {
    if (!database) {
      throw new Error("Database not initialized. Call connectToServer first.");
    }
    return database;
  },

  closeConnection: async (): Promise<void> => {
    await client.close();
  }
};
