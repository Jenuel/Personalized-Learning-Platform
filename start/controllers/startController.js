import client from "../db/client.js";

/**
 * id
 * question
 * answer
 * 
 * id
 * question_id
 * interval
 * next review
 * ease_factor
 * 
 */

const getDueCards = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const query = ``

        // Fill the query with your actual SQL to fetch due cards
        const result = await client.query(query, today);
        res.status(200).json(result.rows)
    } catch (error) {
        console.error("Error fetching due cards:", error);
        res.status(500).json({ error: error.message });
    }
}

const getAllCards = async (req, res) => {
    try {
        // Fill the query with your actual SQL to fetch all cards
        const query = ""
    
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching all cards:", error);
        res.status(500).json({ error: error.message });
    }
}

// Updating the status of the card is after the round


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
    req
}

export { getDueCards, getAllCards, handleCards };