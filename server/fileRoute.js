const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

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

// Importez votre modèle ou vos fonctions de base de données ici pour manipuler les enregistrements
// Exemple: const Fichier = require('../models/Fichier'); 

// Route pour télécharger un fichier et enregistrer son chemin dans la BD
router.post('/file', upload.single('file'), async (req, res) => {
    try {
        const { description } = req.body;
        const lienFichier = `/uploads/${req.file.filename}`;

        // Enregistrer dans la base de données ici
        // Exemple :
        // await Fichier.create({ description, lienFichier });

        res.json({ message: 'Fichier téléchargé avec succès', filePath: lienFichier });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors du téléchargement du fichier' });
    }
});

// Route pour récupérer tous les fichiers
router.get('/file', async (req, res) => {
    try {
        // Récupérer tous les fichiers de la base de données
        // Exemple :
        // const fichiers = await Fichier.findAll();

        res.json({ fichiers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des fichiers' });
    }
});

// Route pour télécharger un fichier spécifique
router.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);

    res.download(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(404).json({ message: 'Fichier non trouvé' });
        }
    });
});

// Route pour supprimer un fichier
router.delete('/file/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Supprimer le fichier de la base de données
        // const fichier = await Fichier.findByPk(id);
        // await fichier.destroy();

        // Supprimer le fichier du dossier "uploads"
        const filePath = path.join(__dirname, '../uploads', fichier.lienFichier);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Erreur lors de la suppression du fichier' });
                return;
            }
            res.json({ message: 'Fichier supprimé avec succès' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression du fichier' });
    }
});

module.exports = router;
