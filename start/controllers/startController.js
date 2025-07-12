import client from "../db/client.js";
import { cardUpdateSchema } from "../schema/cardRequestSchema.js";

const getDueCards = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        const query = `
            SELECT c.cardId, c.question, c.answer
            FROM cards c
            JOIN card_metadata cm ON c.cardId = cm.cardId
            WHERE cm.next_review = $1;
        `;

        const result = await client.query(query, today);
        res.status(200).json(result.rows)
    } catch (error) {
        console.error("Error fetching due cards:", error);
        res.status(500).json({ error: error.message });
    }
}

const getAllCards = async (req, res) => {
    try {
        const query = `
            SELECT c.*, cm.*
            FROM cards c
            JOIN card_metadata cm ON c.cardId = cm.cardId;
        `;
    
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching all cards:", error);
        res.status(500).json({ error: error.message });
    }
}

const updateCard = (is_correct, interval, ease_factor) => {
    if (is_correct) {
        interval = Math.max(1, Math.round(interval * ease_factor));
        ease_factor = Math.max(1.3, ease_factor + 0.1);
    } else {
        interval = 1;
        ease_factor = Math.max(1.3, ease_factor - 0.2);
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    return {
        interval,
        ease_factor,
        next_review: nextReviewDate.toISOString().split('T')[0]
    };
}

const handleCards = async (req, res) => {
    const data = cardUpdateSchema(updates)

    const { updates } = data

    try {
        const results = [];
        for (const update of updates) {
            const { cardId, is_correct, interval, ease_factor } = update;
            const updated = updateCard(is_correct, interval, ease_factor);

            const query = `
                UPDATE card_status
                SET interval = $1, ease_factor = $2, next_review = $3
                WHERE cardId = $4
                RETURNING *;
            `;
            const values = [updated.interval, updated.ease_factor, updated.next_review, cardId];
            const result = await client.query(query, values);
            results.push(result.rows[0]);
        }
        res.status(200).json({ updated: results });
    } catch (error) {
        console.error("Error updating cards:", error);
        res.status(500).json({ error: error.message });
    }
}

export { getDueCards, getAllCards, handleCards };