// This file is responsible for connecting to and interacting with the MongoDB database.

import MongoClient from 'mongodb';

export default class DatabaseConnection {

    constructor() {
        this.connected = false;
        this.db = null;
    }

    connect() {
      // Connect to the MongoDB database
      const username = process.env.MONGO_USERNAME;
      const password = process.env.MONGO_PASSWORD;
      const cluster = process.env.MONGO_CLUSTER;
      const dbName = process.env.MONGO_DB_NAME;

      const that = this;

      return new Promise((resolve, reject) => {

        // Check to make sure we have the information we need to connect
        if (!(username && password && cluster && dbName)) {
          // Couldn't find environment variables
          const error = `Please check your environment variables to make sure the following are defined:
          \t- MONGO_USERNAME
          \t- MONGO_PASSWORD
          \t- MONGO_CLUSTER
          \t- MONGO_DB_NAME
          Connection to MongoDB failed.`;
          console.error(error);
          reject(error);
        } else {
          // We have all the information we need to connect, so attempt to do so
          const mongoUri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}`;

          MongoClient.connect(mongoUri, function (err, client) {
            if (err) {
              const errorFull = `Error connecting to MongoDB instance:\n${err}`;
              console.error(errorFull);
              reject(errorFull);
            } else {
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
              resolve(that.db);
            }
          });
        }
      });
    }

    /**
     * Check to see if we are currently connected to the database.
     * @return {boolean} whether or not a connection to the database is currently open
     */
    isConnected() {
        return this.connected;
    }

    saveDevice(uuid, data) {
      const that = this;
      return new Promise((resolve, reject) => {
        const query = {uuid};
        that.db.collection('devices').replaceOne(query, data, {upsert: true}, (err, dbRes) => {
          if (err) {
            reject(err);
            console.error(err);
          } else {
            resolve();
          }
        });

      })
    }

}
