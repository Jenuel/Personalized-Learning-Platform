import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'auth',
});

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to the PostgreSQL Database");
        return client;
    } catch (error) {
        console.error('PostgreSQL connection error:', error.message);
        throw error;
    }
}

export { connectDB, client };
