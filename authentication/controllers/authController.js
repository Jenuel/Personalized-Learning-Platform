import { findUserByEmail, } from "../models/userModel";
import { loginSchema } from "../schema/authSchema";

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

        const token = await generateAuthToken();

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

export { loginUser }