import { client } from "../db/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

const findUserByEmail = async (email) => {
    const query = `SELECT * FROM users WHERE email = $1`;
    const values = [email]

    const result = await client.query(query, values)
    return result[0];
}

const createUser = async (name, email, password) => {
    const query = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
    `   

    const values = [name, email, password];
    const result = await client.query(query, values);
    return result[0];
}

const generateAuthToken = (payload) => {
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "2h"})
}

const verifyAuthToken = (token) => {
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        return null;
    }
}

export { findUserByEmail, createUser, generateAuthToken }