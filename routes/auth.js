const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const router = express.Router();

// Gunakan secret dari .env biar lebih aman
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key";

// REGISTER
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        // cek email sudah ada atau belum
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length > 0) {
                return res.status(400).json({ msg: 'Email already registered' });
            }

            // hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // simpan user baru
            db.query(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [name, email, hashedPassword],
                (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });

                    // kirim balik data user biar bisa langsung login otomatis
                    res.status(201).json({
                        msg: 'User registered successfully',
                        user: {
                            id: result.insertId,
                            name,
                            email
                        }
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// LOGIN
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const user = results[0];
        if (!user) return res.status(400).json({ msg: 'Invalid credentials (email not found)' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials (wrong password)' });

        // Buat token JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                name: user.name, 
                email: user.email 
            }, // payload
            JWT_SECRET,
            { expiresIn: "1h" } // expired dalam 1 jam
        );

        // kirim balik token + data user
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            msg: 'Login successful'
        });
    });
});

module.exports = router;
