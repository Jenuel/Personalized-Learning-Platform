import { createUser, findUserByEmail, generateAuthToken, } from "../models/userModel";
import { loginSchema, registerSchema } from "../schema/authSchema";
import bcrypt from 'bcrypt'

const loginUser = async (req, res) => {

    try {
        const data = loginSchema.parse(req.body)
        const { email, password } = data;

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = await generateAuthToken({ id: user.id, email: user.email });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const registerUser = async (req, res) => {
    try {
        const data = registerSchema(req.body)
        const { name, email, password } = data;

        const user = await findUserByEmail(email)
        if (user) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const createdUser = await createUser(name, email, hashedPassword)


    } catch (error) {
        
    }
}
export { loginUser, registerUser }