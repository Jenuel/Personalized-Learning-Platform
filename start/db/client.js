import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'cards_db',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5431,
});

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL Database');
        return client;
    } catch (err) {
        console.error('PostgreSQL connection error:', err.message);
        throw err; 
    }
}

export { connectDB, client };
