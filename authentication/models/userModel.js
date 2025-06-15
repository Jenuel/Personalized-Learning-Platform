import { client } from "../db/client";


const findUserByEmail = async (email) => {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email]

    const result = await client.query(query, values)
    return result[0];
}

export { findUserByEmail }