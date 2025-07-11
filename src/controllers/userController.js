const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // <-- NUEVA IMPORTACIÓN

// Asegúrate de tener una variable de entorno para tu secreto de JWT
// Ejemplo en un archivo .env: JWT_SECRET="tu_secreto_super_seguro_y_largo"
// Y en tu index.js o server.js del backend:
// require('dotenv').config();
// const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Usar una por defecto para desarrollo si no tienes .env

//Create user (ya lo tienes, solo por referencia)
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.createUser({
            username,
            email,
            password: hashedPassword,
        });
        res
            .status(201)
            .json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error(error);
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                error:
                    "That email address is already in use. Please use a different email address.",
            });
        }
        res
            .status(500)
            .json({ error: "An error occurred while creating the user." });
    }
};

// --- FUNCIÓN DE LOGIN  ---
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        // 1. Buscar el usuario por email
        const user = await userModel.getUserByEmail(email);

        if (!user) {
            // Usuario no encontrado
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // 2. Comparar la contraseña ingresada con la contraseña hasheada en la BD
        const isMatch = await bcrypt.compare(password, user.password); // user.password debe ser el hash de la BD

        if (!isMatch) {
            // Contraseña incorrecta
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // 3. Generar un JWT si las credenciales son válidas
        // El payload del token contiene la información que quieres guardar sobre el usuario
        // Aquí incluimos el ID y el email (no incluyas información sensible como la contraseña)
        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username }, // Puedes añadir más datos relevantes aquí
            JWT_SECRET, // Usa tu secreto JWT_SECRET
            { expiresIn: '1h' } // El token expirará en 1 hora
        );

        // 4. Devolver el token y algunos datos del usuario (sin el hash de la contraseña)
        res.status(200).json({
            message: "Login successful!",
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                // Puedes añadir otros campos que el frontend necesite
            },
        });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "An error occurred during login." });
    }
};

module.exports = {
    registerUser,
    loginUser, 
};