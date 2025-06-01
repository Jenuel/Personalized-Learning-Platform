import client from "../db/client.js";

const getDueCards = async (req, res) => {
    try {
        // Fill the query with your actual SQL to fetch due cards
        const result = await client.query();
        res.status(200).json(result.rows)
    } catch (error) {
        console.error("Error fetching due cards:", error);
        res.status(500).json({ error: error.message });
    }
}

const getAllCards = async (req, res) => {
    try {
        // Fill the query with your actual SQL to fetch all cards
        const result = await client.query();
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching all cards:", error);
        res.status(500).json({ error: error.message });
    }
}

// Updating the status of the card is after the round
const updateCardsStatus = async (req, res) => {
    req
}

export { getDueCards, getAllCards, updateCardsStatus };