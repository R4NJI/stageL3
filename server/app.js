const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); // Connexion à la base de données

const app = express();
app.use(cors()); // gérer le cors
app.use(bodyParser.json()); // Middleware pour analyser le JSON


//Logique des apis
app.get('/api/assujettis', (req, res) => {
  const sql = `SELECT * FROM "NIFONLINE"."ASSUJETTIS"`;
  db.query(sql, (err, result ) => {
    if (err) return res.json({Message: "Erreur pour récupérer les assujettis"});
    else return res.json(result);
  })
})

app.get('/api/centre_fiscal', (req, res) => {
  const sql = `SELECT * FROM "NIFONLINE"."CENTRE_FISCAL"`;
  db.query(sql, (err, result ) => {
    if (err) return res.json({Message: "Erreur pour récupérer les centres fiscaux"});
    else return res.json(result);
  })
})

app.get('/api/central_recette', (req, res) => {
  const sql = `SELECT * FROM "NIFONLINE"."CENTRAL_RECETTE"`;
  db.query(sql, (err, result ) => {
    if (err) return res.json({Message: "Erreur pour récupérer les recettes centrales"});
    else return res.json(result);
  })
})

app.get('/api/centre_gestionnaire', (req, res) => {
  const sql = `SELECT * FROM "NIFONLINE"."CENTRE_GESTIONNAIRE"`;
  db.query(sql, (err, result ) => {
    if (err) return res.json({Message: "Erreur pour récupérer les centres gestionnaires"});
    else return res.json(result);
  })
})

app.post('/api/recettes', (req, res) => {
  const { annee, moisDebut, moisFin, centre, nature } = req.body; // On récupère les paramètres envoyés

  // Requête pour obtenir la recette totale
  const recetteTotale = `
    SELECT SUM(tot_ver) AS somme_totale
    FROM "NIFONLINE"."CENTRAL_RECETTE"
    WHERE EXTRACT(YEAR FROM daty) = $1
      AND EXTRACT(MONTH FROM daty) BETWEEN $2 AND $3
      AND code_bureau = $4
      AND num_imp = $5`; // Conditions avec année, mois, centre et nature

  // Requête pour obtenir la recette par mois
  const recetteParMois = `
    SELECT 
      EXTRACT(YEAR FROM daty) AS annee, 
      EXTRACT(MONTH FROM daty) AS mois, 
      SUM(tot_ver) AS somme_recettes
    FROM 
      "NIFONLINE"."CENTRAL_RECETTE"
    WHERE 
      EXTRACT(YEAR FROM daty) = $1
      AND EXTRACT(MONTH FROM daty) BETWEEN $2 AND $3
      AND code_bureau = $4
      AND num_imp = $5
    GROUP BY 
      EXTRACT(YEAR FROM daty), 
      EXTRACT(MONTH FROM daty)
    ORDER BY 
      annee, mois`;

  // Exécution des deux requêtes de manière parallèle avec Promise.all
  Promise.all([
    db.query(recetteTotale, [annee, moisDebut, moisFin, centre, nature]),
    db.query(recetteParMois, [annee, moisDebut, moisFin, centre, nature])
  ])
  .then(([totaleResult, parMoisResult]) => {
    res.json({
      somme_totale: totaleResult.rows[0]?.somme_totale || 0,
      recettes_par_mois: parMoisResult.rows
    });
  })
  .catch(err => {
    console.error("Erreur SQL: ", err);
    res.status(500).json({ message: "Erreur pour récupérer les données filtrées" });
  });
});


const port = 3001;

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
