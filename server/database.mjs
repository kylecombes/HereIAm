// This file is responsible for connecting to and interacting with the MongoDB database.

import MongoClient from 'mongodb';

export default class DatabaseConnection {

    constructor() {
        this.connected = false;
        this.db = null;
    }

    connect(successCallback=null) {
        // TODO Return a Promise to track connection success/failure

      // Connect to the MongoDB database
      const username = process.env.MONGO_USERNAME;
      const password = process.env.MONGO_PASSWORD;
      const cluster = process.env.MONGO_CLUSTER;
      const dbName = process.env.MONGO_DB_NAME;

      const that = this;

      // Check to make sure we have the information we need to connect
      if (!(username && password && cluster && dbName)) {
        // Couldn't find environment variables
        console.error('Please check your environment variables to make sure the following are defined:');
        console.error('\t- MONGO_USERNAME');
        console.error('\t- MONGO_PASSWORD');
        console.error('\t- MONGO_CLUSTER');
        console.error('\t- MONGO_DB_NAME');
        console.error('Connection to MongoDB failed.');
      } else {
        // We have all the information we need to connect, so attempt to do so
        const mongoUri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}`;

        MongoClient.connect(mongoUri, function(err, client) {
          if (!err) {
            console.log('Successfully connected to MongoDB instance.');
            that.db = client.db(dbName);
            that.connected = true;
            that.db.on('close', () => {
              console.log('Lost connection to MongoDB instance. Attempting to reconnect...');
              that.connected = false;
            });
            that.db.on('reconnect', () => {
              console.log('Successfully reconnected to MongoDB instance.');
              that.connected = true;
            });
          } else {
            console.error(err);
            console.error('Error connecting to MongoDB instance.');
          }
        });
      }
    }

    /**
     * Check to see if we are currently connected to the database.
     * @return {boolean} whether or not a connection to the database is currently open
     */
    isConnected() {
        return this.connected;
    }

}
