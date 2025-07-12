import { client } from "./client";


export async function createTables() {
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS flashcards (
                cardId SERIAL PRIMARY KEY,
                question TEXT NOT NULL,
                answer TEXT NOT NULL
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS card_metadata (
                cardId INTEGER PRIMARY KEY REFERENCES flashcards(cardId) ON DELETE CASCADE,
                interval INTEGER DEFAULT 0,
                next_review DATE DEFAULT CURRENT_DATE,
                ease_factor FLOAT DEFAULT 2.5
            );
        `);

        console.log("Successfully created the tables.")
    } catch (error) {
        console.error("Error in creating tables:", error)
        throw error;
    }
}