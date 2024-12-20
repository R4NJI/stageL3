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
    const { rows } = await pool.query('SELECT * FROM "NIFONLINE"."USER" WHERE id = $1', [req.user.id]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
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
      { id: user.rows[0].id, username: user.rows[0].username, droit: user.rows[0].droit},  // Utilise user.rows[0]
        process.env.SECRET_KEY,
      { expiresIn: '3h' }
    );

    // Renvoyer le token et les informations utilisateur
    res.json({
      token,
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
        droit: user.rows[0].droit
        // Ajoute d'autres informations si nécessaire
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});
//Route pour obtenir tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const utilisateurs = await pool.query('SELECT * FROM "NIFONLINE"."USER" ORDER BY id');
    res.json(utilisateurs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur pour récupérer tous les utilisateurs' });
  }

});
//Route pour ajouter un nouveau utilisateur
router.post('/users', async (req, res) => {
  try {
    const { username, password, droit } = req.body;

    // Utilisation correcte des paramètres préparés
    await pool.query(
      'INSERT INTO "NIFONLINE"."USER" (username, password, droit) VALUES ($1, $2, $3)', 
      [username, password, droit]
    );

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'insertion utilisateur:', error); // Log pour debug
    res.status(500).json({ message: 'Erreur pour ajouter un utilisateur' });
  }
});
//Route pour modifier les inforomations d'un utilisateur
router.put('/users', async (req, res) => {
  try {
    // Récupère l'ID de l'utilisateur depuis l'URL
    const { username, lastpassword,  password, droit, id } = req.body; // Récupère les nouvelles données du corps de la requête

    const user = await pool.query('SELECT * FROM "NIFONLINE"."USER" WHERE id = $1', [id]);
    if (user.rows[0]?.password!=lastpassword)  return res.status(400).json({ message: 'Ancien mot de passe incorrect' });

    // Requête SQL pour la mise à jour
    if (password!='') {
      await pool.query(
        `
        UPDATE "NIFONLINE"."USER" 
        SET username = $1, password = $2, droit = $3 
        WHERE id = $4
        `,
        [username, password, droit, id]
      );
    } else {
      await pool.query(
        `
        UPDATE "NIFONLINE"."USER" 
        SET username = $1, password = $2, droit = $3 
        WHERE id = $4
        `,
        [username, lastpassword, droit, id]
      );
    }

    res.status(200).json({ message: 'Utilisateur modifié avec succès' });
  } catch (error) {
    console.error('Erreur lors de la modification:', error);
    res.status(500).json({ message: 'Erreur de modification' });
  }

});
//Route pour supprimer un utilisateur
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
      // Vérifier si l'utilisateur existe
      const user = await pool.query('SELECT * FROM "NIFONLINE"."USER" WHERE id = $1', [id]);;
      if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé." });
      }

      // Supprimer l'utilisateur
        await pool.query(
          'DELETE FROM "NIFONLINE"."USER" WHERE id=$1',
            [id]
          );
      res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur :', error);
      res.status(500).json({ message: "Erreur lors de la suppression" });
  }
});



module.exports = router;
