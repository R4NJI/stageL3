const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db');
const router = express.Router();
const authenticateToken = require('./authenticateToken')
const jwt = require('jsonwebtoken');
require('dotenv').config();


// Récupérer les informations de l'utilisateur
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT username FROM "NIFONLINE"."USER" WHERE id = $1', [req.user.id]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour les informations de l'utilisateur
router.put('/user', authenticateToken, async (req, res) => {
  const { username, password } = req.body;
  try {
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    await pool.query(
      'UPDATE "NIFONLINE"."USER" SET username = $1, password = COALESCE($2, password) WHERE id = $3',
      [username, req.user.id]
    );
    res.json({ message: 'Informations mises à jour' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
});

// Route pour la connexion
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM "NIFONLINE"."USER" WHERE username = $1', [username]);
    if (user.rows.length === 0) return res.status(400).json({ message: 'Utilisateur non trouvé' });

    // Comparaison du mot de passe
    const validPassword = password === user.rows[0].password;  // Remplace par bcrypt si tu utilises bcrypt
    if (!validPassword) return res.status(400).json({ message: 'Mot de passe incorrect' });

    // Création du token avec les bonnes variables
    const token = jwt.sign(
      { id: user.rows[0].id, username: user.rows[0].username },  // Utilise user.rows[0]
        process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Envoi du token au client
    res.json({ token });
    
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

module.exports = router;
