const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const pool = require('./db')
const fs = require('fs'); // Import du module File System

// Configuration de Multer pour stocker les fichiers dans le dossier "uploads"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nom unique du fichier
    }
});

const upload = multer({ storage: storage });



// Route pour télécharger un fichier et enregistrer son chemin dans la BD
router.post('/file', upload.single('fichier'), async (req, res) => {
    try {
        console.log(req.body.description);
        const { description } = req.body;
        const nomfichier = req.file.filename;
        const lienFichier = `/uploads/${req.file.filename}`;

        // Récupérer la date et l'heure actuelles du système
        const datefichier = new Date();  // La date du système au format ISO

        // Enregistrer dans la base de données ici
        await pool.query(
            'INSERT INTO "NIFONLINE"."FICHIER" (description,chemin,nomfichier,datefichier) VALUES($1,$2,$3,$4)',
            [description, lienFichier, nomfichier,datefichier]);

        res.json({ message: 'Fichier ajouté avec succès', filePath: lienFichier });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout du fichier' });
    }
});

//route pour modifier un fichier
router.put('/file', upload.single('fichier'), async (req, res) => {
    try {
        console.log(req.body.description);
        const { description, numerofichier } = req.body;
        if (req.file) {
            const nomfichier = req.file.filename;
            const lienFichier = `/uploads/${req.file.filename}`;

            // Récupérer la date et l'heure actuelles du système
            const datefichier = new Date();  // La date du système au format ISO

            // Enregistrer dans la base de données ici
            await pool.query(
                'UPDATE "NIFONLINE"."FICHIER" SET description=$1,chemin=$2,nomfichier=$3,datefichier=$4 WHERE numerofichier=$5',
                [description, lienFichier, nomfichier,datefichier,numerofichier]);

            res.json({ message: 'Fichier supprimé avec succès', filePath: lienFichier });
        } else {
            // Enregistrer dans la base de données ici
            await pool.query(
                'UPDATE "NIFONLINE"."FICHIER" SET description=$1 WHERE numerofichier=$2',
                [description,numerofichier]);

            res.json({ message: 'Fichier supprimé avec succès'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la modification' });
    }
});

// Route pour récupérer tous les fichiers
router.get('/file', async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM "NIFONLINE"."FICHIER" ORDER BY numerofichier');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des fichiers' });
    }
});

// Route pour télécharger un fichier spécifique
router.get('/file/:nomfichier', (req, res) => {

    const { nomfichier } = req.params;
    const filePath = path.join(__dirname, 'uploads', nomfichier);
    res.download(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Erreur lors du téléchargement du fichier.' });
        }
    });
});


// Route pour supprimer un fichier
router.delete('/file/:numerofichier', async (req, res) => {
    try {
        const { numerofichier } = req.params;

        // Récupérer les informations du fichier depuis la base de données
        const result = await pool.query(
            'SELECT nomfichier FROM "NIFONLINE"."FICHIER" WHERE numerofichier=$1',
            [numerofichier]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Fichier non trouvé" });
        }

        const { nomfichier } = result.rows[0];

        // Supprimer le fichier de la base de données
        await pool.query(
            'DELETE FROM "NIFONLINE"."FICHIER" WHERE numerofichier=$1',
            [numerofichier]
        );

        // Supprimer le fichier du dossier "uploads"
        const filePath = path.join(__dirname, 'uploads', nomfichier);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Erreur lors de la suppression du fichier :", err);
                return res.status(500).json({ message: "Erreur lors de la suppression du fichier" });
            }

            res.json({ message: "Fichier supprimé avec succès" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la suppression" });
    }
});

module.exports = router;
