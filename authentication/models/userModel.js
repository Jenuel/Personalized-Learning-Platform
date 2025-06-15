import { client } from "../db/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

const findUserByEmail = async (email) => {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email]

    const result = await client.query(query, values)
    return result[0];
}

const generateAuthToken = (payload) => {
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "2h"})
}

export { findUserByEmail, generateAuthToken }