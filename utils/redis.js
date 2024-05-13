import { createClient } from 'redis';
import { promisify } from 'util';


class RedisClient {
    constructor() {
        this.client = redis.createClient();        
        this.client.on('error', (err) => {
            console.error('Redis client error:', err);
        });
    }

    // Check if the connection to Redis is alive
    isAlive() {
        return this.client.connected;
    }

    // Get the value stored in Redis for a given key
    async get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            });
        });
    }

    // Set a value in Redis for a given key with an expiration duration
    async set(key, value, duration) {
        return new Promise((resolve, reject) => {
            this.client.setex(key, duration, value, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            });
        });
    }

    // Remove the value stored in Redis for a given key
    async del(key) {
        return new Promise((resolve, reject) => {
            this.client.del(key, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            });
        });
    }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;
