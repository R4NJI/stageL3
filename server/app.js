const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); // Connexion à la base de données
const userRoute = require('./userRoute');
const fileRoute = require('./fileRoute');
require('dotenv').config();
const authenticateToken = require('./authenticateToken');

const app = express();
app.use(cors()); // gérer le cors
app.use(bodyParser.json()); // Middleware pour analyser le JSON

app.use('/api',userRoute);

app.use('/api',fileRoute);

//Logique des apis
app.get('/api/assujettis', (req, res) => {
  const sql = `SELECT * FROM "NIFONLINE"."ASSUJETTIS"
               ORDER BY num_imp ASC `;
  db.query(sql, (err, result ) => {
    if (err) return res.json({Message: "Erreur pour récupérer les assujettis"});
    else return res.json(result);
  })
})

app.get('/api/central_recette', (req, res) => {
  const sql = `SELECT * FROM "NIFONLINE"."CENTRAL_RECETTE"
                ORDER BY id_centre_recette ASC `;
  db.query(sql, (err, result ) => {
    if (err) return res.json({Message: "Erreur pour récupérer les recettes centrales"});
    else return res.json(result);
  })
})

app.get('/api/centre_gestionnaire', (req, res) => {
  const sql = `SELECT * FROM "NIFONLINE"."CENTRE_GESTIONNAIRE"
                ORDER BY code_bureau ASC `;
  db.query(sql, (err, result ) => {
    if (err) return res.json({Message: "Erreur pour récupérer les centres gestionnaires"});
    else return res.json(result);
  })
})

app.get('/api/prevision', (req, res) => {
  const sql = `SELECT * FROM "NIFONLINE"."PREVISION"
                ORDER BY id_prev ASC `;
  db.query(sql, (err, result ) => {
    if (err) return res.json({Message: "Erreur pour récupérer les centres gestionnaires"});
    else return res.json(result);
  })
})

app.post('/api/recettes', (req, res) => {
  const { annee, moisDebut, moisFin, centre, nature } = req.body;

  // Initialisation des conditions SQL et des paramètres
  let conditions = `EXTRACT(YEAR FROM daty) = $1 AND EXTRACT(MONTH FROM daty) BETWEEN $2 AND $3`;
  let params = [annee, moisDebut, moisFin]; // Paramètres obligatoires (annee, moisDebut, moisFin)
  
  // Ajout de la condition pour le centre si ce n'est pas "Tous"
  if (centre && centre !== 'Tous') {
    conditions += ` AND code_bureau = $4`;
    params.push(centre);
  }

  // Ajout de la condition pour la nature si ce n'est pas "Tous"
  if (nature && nature !== 'Tous') {
    const paramIndex = params.length + 1; // Calcul de l'index pour num_imp
    conditions += ` AND num_imp = $${paramIndex}`;
    params.push(nature);
  }

  // Requête pour obtenir la recette totale
  const recetteTotale = `
    SELECT SUM(tot_ver) AS somme_totale
    FROM "NIFONLINE"."CENTRAL_RECETTE"
    WHERE ${conditions}`;

  // Requête pour obtenir la recette par mois
  const recetteParMois = `
    SELECT 
      EXTRACT(YEAR FROM daty) AS annee, 
      EXTRACT(MONTH FROM daty) AS mois, 
      SUM(tot_ver) AS somme_recettes
    FROM 
      "NIFONLINE"."CENTRAL_RECETTE"
    WHERE ${conditions}
    GROUP BY 
      EXTRACT(YEAR FROM daty), 
      EXTRACT(MONTH FROM daty)
    ORDER BY 
      annee, mois`;

  // Requête pour obtenir la recette cumule
  let recetteCumule = `
    SELECT SUM(tot_ver) AS somme_cumule
    FROM "NIFONLINE"."CENTRAL_RECETTE"
    WHERE 
      EXTRACT(YEAR FROM daty) = $1 AND 
      EXTRACT(MONTH FROM daty) BETWEEN 1 AND $2
    `
  let cumuleParams = [annee, moisDebut]; // Les paramètres de la requête de prévision

  if (centre && centre !== 'Tous') {
    recetteCumule += ` AND code_bureau = $3`;
    cumuleParams.push(centre);
  }

  if (nature && nature !== 'Tous') {
    const paramIndex = cumuleParams.length + 1;
    recetteCumule += ` AND num_imp::integer = $${paramIndex}`;
    cumuleParams.push(nature);
  }

  // Requête pour obtenir la prévision du mois
  let previsionMois = `
    SELECT 
      annee_prev, 
      mois_prev, 
      SUM(prevision) AS somme_prevision
    FROM 
      "NIFONLINE"."PREVISION"
    WHERE 
      annee_prev = $1
      AND mois_prev::integer BETWEEN $2 AND $3`;
    

  let previsionParams = [annee, moisDebut, moisFin]; // Les paramètres de la requête de prévision

  if (centre && centre !== 'Tous') {
    previsionMois += ` AND code_bureau = $4`;
    previsionParams.push(centre);
  }

  if (nature && nature !== 'Tous') {
    const paramIndex = previsionParams.length + 1;
    previsionMois += ` AND num_imp::integer = $${paramIndex}`;
    previsionParams.push(nature);
  }

  previsionMois += ` GROUP BY 
      annee_prev, 
      mois_prev
    ORDER BY 
      annee_prev, mois_prev`;



  // Requête pour obtenir les rangs
  let rangSql = `
  SELECT 
    EXTRACT(YEAR FROM daty) AS annee, 
    code_bureau, 
    SUM(tot_ver) AS somme_recettes,
    RANK() OVER (PARTITION BY EXTRACT(YEAR FROM daty) ORDER BY SUM(tot_ver) DESC) AS rang
  FROM 
    "NIFONLINE"."CENTRAL_RECETTE"
  WHERE 
    EXTRACT(YEAR FROM daty) = $1 
    AND EXTRACT(MONTH FROM daty) BETWEEN $2 AND $3 
  `

  let rangParams = [annee, moisDebut, moisFin];

  if (nature && nature !== 'Tous') {
    const paramIndex = rangParams.length + 1;
    rangSql += ` AND num_imp::integer = $${paramIndex}`;
    rangParams.push(nature);
  }

  rangSql += ` GROUP BY 
    EXTRACT(YEAR FROM daty), 
    code_bureau
  ORDER BY 
    annee ASC, 
    somme_recettes DESC;`


  //prevision totale
  let previsionTotale = `
    SELECT SUM(prevision) AS prevision_totale
    FROM "NIFONLINE"."PREVISION"
    WHERE 
      annee_prev = $1
      AND mois_prev::integer BETWEEN $2 AND $3
  `
  //prevision totale cumulée
  let previsionCumule = `
    SELECT SUM(prevision) AS prevision_totale
    FROM "NIFONLINE"."PREVISION"
    WHERE 
      annee_prev = $1
      AND mois_prev::integer BETWEEN 1 AND $2
  `

  //recette par nature
  let recetteParNature = `
  SELECT
    EXTRACT(YEAR FROM cr.daty) AS annee, 
    a.num_imp,a.abrev, 
    SUM(cr.tot_ver) AS total_ver
  FROM "NIFONLINE"."ASSUJETTIS" as a
  INNER JOIN "NIFONLINE"."CENTRAL_RECETTE" as cr
  ON a.num_imp = cr.num_imp
  WHERE EXTRACT(YEAR FROM cr.daty) = $1
  AND EXTRACT(MONTH FROM cr.daty) BETWEEN $2 AND $3
  `

  //recette par bureau
  let recetteParBureau = `
  SELECT
  EXTRACT(YEAR FROM cr.daty) AS annee, 
    cg.code_bureau,cg.cg_abbrev, 
    SUM(cr.tot_ver) AS total_ver
  FROM "NIFONLINE"."CENTRE_GESTIONNAIRE" as cg
  INNER JOIN "NIFONLINE"."CENTRAL_RECETTE" as cr
  ON cg.code_bureau = cr.code_bureau
  WHERE EXTRACT(YEAR FROM cr.daty) = $1
  AND EXTRACT(MONTH FROM cr.daty) BETWEEN $2 AND $3
  `

  let previsionTotaleParams = [annee,moisDebut, moisFin];
  let previsionCumuleParams = [annee,moisDebut];
  let recetteParNatureParams = [annee,moisDebut, moisFin];
  let recetteParBureauParams = [annee,moisDebut, moisFin];

  if (centre && centre !== 'Tous') {
    previsionTotale += ` AND code_bureau = $4`;
    previsionCumule += ` AND code_bureau = $3`;
    recetteParNature += ` AND cr.code_bureau = $4`;
    previsionTotaleParams.push(centre);
    recetteParNatureParams.push(centre);
    previsionCumuleParams.push(centre);
  }

  if (nature && nature !== 'Tous') {
    const paramIndex = previsionTotaleParams.length + 1;
    previsionTotale += ` AND num_imp::integer = $${paramIndex}`;
    previsionTotaleParams.push(nature);

    const paramIndex3 = previsionCumuleParams.length + 1;
    previsionCumule += ` AND num_imp::integer = $${paramIndex3}`;
    previsionCumuleParams.push(nature);
    
    const paramIndex2 = recetteParBureauParams.length + 1;
    recetteParBureau += ` AND cr.num_imp::integer = $${paramIndex2}`;
    recetteParBureauParams.push(nature);

  }

  recetteParNature += ` GROUP BY 
      EXTRACT(YEAR FROM cr.daty), 
      a.num_imp, 
      a.abrev
    ORDER BY 
      annee, a.num_imp;
  `

  recetteParBureau += ` GROUP BY 
  EXTRACT(YEAR FROM cr.daty), 
    cg.code_bureau, 
    cg.cg_abbrev
  ORDER BY 
      annee, cg.code_bureau;
  `

  // Logs pour diagnostiquer
  // console.log('Params:', params);
  // console.log('SQL Query for Recette Totale:', recetteTotale);
  // console.log('SQL Query for Recette Par Mois:', recetteParMois);
  // console.log('SQL Query for Prevision Mois:', previsionMois);
  // console.log('Cumule Params:', cumuleParams);
  // console.log('SQL Query for Recette cumule:', recetteCumule);
  // console.log('Rang Params:', rangParams);
  // console.log('SQL Query for rang:', rangSql);
  // console.log('Prevision totale params:', previsionTotale);
  // console.log('SQL Query for previsionTotale:', previsionTotaleParams);
  // console.log('SQL Query for recetteParNature:', recetteParNature);
  // console.log('Recette par nature params:', recetteParNatureParams);
  // console.log('SQL Query for recetteParBureau:', recetteParBureau);
  // console.log('Recette par bureau params:', recetteParBureauParams);


  // Exécution des requêtes SQL de manière parallèle avec Promise.all
  Promise.all([
    db.query(recetteTotale, params),
    db.query(recetteParMois, params),
    db.query(recetteCumule, cumuleParams),
    db.query(previsionMois, previsionParams),
    db.query(rangSql, rangParams),
    db.query(previsionTotale,previsionTotaleParams),
    db.query(previsionCumule,previsionCumuleParams),
    db.query(recetteParNature,recetteParNatureParams),
    db.query(recetteParBureau,recetteParBureauParams)
  ])
  .then(([totaleResult, parMoisResult,cumuleResult, parMoisResultPrev , rangResult,prevTotalResult, prevCumuleResult, recetteParNatureResult, recetteParBureauResult]) => {
    res.json({
      somme_totale: totaleResult.rows[0]?.somme_totale || 0,
      recettes_par_mois: parMoisResult.rows,
      somme_cumule: cumuleResult.rows[0]?.somme_cumule || 0,
      prevision: parMoisResultPrev.rows,
      rang_data: rangResult.rows,
      somme_prevision : prevTotalResult.rows[0]?.prevision_totale || 0,
      prevision_cumule : prevCumuleResult.rows[0]?.prevision_totale || 0,
      recettes_par_nature: recetteParNatureResult.rows,
      recettes_par_bureau : recetteParBureauResult.rows
    });
  })
  .catch(err => {
    console.error("Erreur SQL: ", err);
    res.status(500).json({ message: "Erreur pour récupérer les données filtrées" });
  });
});

app.post('/api/flux', (req, res) => {
  const { annee, mois } = req.body;
  // console.log('mois:',mois);

  let fluxCentre = `
  SELECT cg.code_bureau AS code,cg.cg_abbrev AS bureaux, 
		SUM(pre.prevision) AS previsions, 
		SUM(cr.tot_ver) AS recettes,
    pre.mois_prev,pre.annee_prev

  FROM "NIFONLINE"."CENTRE_GESTIONNAIRE" AS cg,
    "NIFONLINE"."PREVISION" AS pre,
    "NIFONLINE"."CENTRAL_RECETTE" AS cr

  WHERE cg.code_bureau=cr.code_bureau AND
    cg.code_bureau=pre.code_bureau AND
    pre.mois_prev::integer=EXTRACT(MONTH FROM cr.daty) AND
    pre.annee_prev::integer=EXTRACT(YEAR FROM cr.daty) AND
    pre.mois_prev::integer=$1 AND pre.annee_prev::integer=$2

  GROUP BY 
    cg.code_bureau,cg.cg_abbrev,pre.mois_prev,pre.annee_prev

  ORDER BY 
  	cg.code_bureau,cg.cg_abbrev,pre.mois_prev,pre.annee_prev
  `

  let totalCentre = `
  SELECT 
		SUM(pre.prevision) AS previsions, 
		SUM(cr.tot_ver) AS recettes,
    pre.mois_prev,pre.annee_prev

  FROM "NIFONLINE"."CENTRE_GESTIONNAIRE" AS cg,
    "NIFONLINE"."PREVISION" AS pre,
    "NIFONLINE"."CENTRAL_RECETTE" AS cr

  WHERE cg.code_bureau=cr.code_bureau AND
    cg.code_bureau=pre.code_bureau AND
    pre.mois_prev::integer=EXTRACT(MONTH FROM cr.daty) AND
    pre.annee_prev::integer=EXTRACT(YEAR FROM cr.daty) AND
    pre.mois_prev::integer=$1 AND pre.annee_prev::integer=$2

  GROUP BY 
    pre.mois_prev,pre.annee_prev

  ORDER BY 
  	pre.mois_prev,pre.annee_prev
  `

  let fluxCentreCumule = `
 SELECT 
 		cg.code_bureau AS code,
		cg.cg_abbrev AS bureaux,
		SUM(pre.prevision) AS previsions, 
		SUM(cr.tot_ver) AS recettes,
  		pre.annee_prev

  FROM "NIFONLINE"."CENTRE_GESTIONNAIRE" AS cg,
    "NIFONLINE"."PREVISION" AS pre,
    "NIFONLINE"."CENTRAL_RECETTE" AS cr

  WHERE cg.code_bureau=cr.code_bureau AND
    cg.code_bureau=pre.code_bureau AND
    pre.mois_prev::integer=EXTRACT(MONTH FROM cr.daty) AND
    pre.annee_prev::integer=EXTRACT(YEAR FROM cr.daty) AND
	  pre.mois_prev::integer BETWEEN 1 and $1
    AND pre.annee_prev::integer=$2

  GROUP BY 
    cg.code_bureau,cg.cg_abbrev,pre.annee_prev
	
  ORDER BY 
  	cg.code_bureau,cg.cg_abbrev,pre.annee_prev
  `
  let totalCentreCumule = `
 SELECT 
		SUM(pre.prevision) AS previsions, 
		SUM(cr.tot_ver) AS recettes,
  		pre.annee_prev

  FROM "NIFONLINE"."CENTRE_GESTIONNAIRE" AS cg,
    "NIFONLINE"."PREVISION" AS pre,
    "NIFONLINE"."CENTRAL_RECETTE" AS cr

  WHERE cg.code_bureau=cr.code_bureau AND
    cg.code_bureau=pre.code_bureau AND
    pre.mois_prev::integer=EXTRACT(MONTH FROM cr.daty) AND
    pre.annee_prev::integer=EXTRACT(YEAR FROM cr.daty) AND
	  pre.mois_prev::integer BETWEEN 1 and $1
    AND pre.annee_prev::integer=$2

  GROUP BY 
    pre.annee_prev
	
  ORDER BY 
  	pre.annee_prev
  `

  let fluxNature = `
    SELECT asu.num_imp AS code,asu.abrev AS nature, 
		SUM(pre.prevision) AS previsions, 
		SUM(cr.tot_ver) AS recettes,
    pre.mois_prev,pre.annee_prev

  FROM "NIFONLINE"."ASSUJETTIS" AS asu,
    "NIFONLINE"."PREVISION" AS pre,
    "NIFONLINE"."CENTRAL_RECETTE" AS cr

  WHERE asu.num_imp=cr.num_imp AND
    asu.num_imp=pre.num_imp AND
    pre.mois_prev::integer=EXTRACT(MONTH FROM cr.daty) AND
    pre.annee_prev::integer=EXTRACT(YEAR FROM cr.daty) AND
    pre.mois_prev::integer=$1 AND pre.annee_prev::integer=$2

  GROUP BY 
    asu.num_imp,asu.abrev,pre.mois_prev,pre.annee_prev

  ORDER BY 
  	asu.num_imp,asu.abrev,pre.mois_prev,pre.annee_prev
  `
  let totalNature = `
    SELECT  
		SUM(pre.prevision) AS previsions, 
		SUM(cr.tot_ver) AS recettes,
    pre.mois_prev,pre.annee_prev

  FROM "NIFONLINE"."ASSUJETTIS" AS asu,
    "NIFONLINE"."PREVISION" AS pre,
    "NIFONLINE"."CENTRAL_RECETTE" AS cr

  WHERE asu.num_imp=cr.num_imp AND
    asu.num_imp=pre.num_imp AND
    pre.mois_prev::integer=EXTRACT(MONTH FROM cr.daty) AND
    pre.annee_prev::integer=EXTRACT(YEAR FROM cr.daty) AND
    pre.mois_prev::integer=$1 AND pre.annee_prev::integer=$2

  GROUP BY 
   pre.mois_prev,pre.annee_prev

  ORDER BY 
  	pre.mois_prev,pre.annee_prev
  `

  let fluxNatureCumule = `
  SELECT asu.num_imp AS code,asu.abrev AS nature, 
		SUM(pre.prevision) AS previsions, 
		SUM(cr.tot_ver) AS recettes,
    	pre.annee_prev

  FROM "NIFONLINE"."ASSUJETTIS" AS asu,
    "NIFONLINE"."PREVISION" AS pre,
    "NIFONLINE"."CENTRAL_RECETTE" AS cr

  WHERE asu.num_imp=cr.num_imp AND
    asu.num_imp=pre.num_imp AND
    pre.mois_prev::integer=EXTRACT(MONTH FROM cr.daty) AND
    pre.annee_prev::integer=EXTRACT(YEAR FROM cr.daty) AND
	pre.mois_prev::integer BETWEEN 1 and $1
    AND pre.annee_prev::integer=$2
	

  GROUP BY 
    asu.num_imp,asu.abrev,pre.annee_prev

  ORDER BY 
  	asu.num_imp,asu.abrev,pre.annee_prev
  `
  
  let totalNatureCumule = `
  SELECT
		SUM(pre.prevision) AS previsions, 
		SUM(cr.tot_ver) AS recettes,
    	pre.annee_prev

  FROM "NIFONLINE"."ASSUJETTIS" AS asu,
    "NIFONLINE"."PREVISION" AS pre,
    "NIFONLINE"."CENTRAL_RECETTE" AS cr

  WHERE asu.num_imp=cr.num_imp AND
    asu.num_imp=pre.num_imp AND
    pre.mois_prev::integer=EXTRACT(MONTH FROM cr.daty) AND
    pre.annee_prev::integer=EXTRACT(YEAR FROM cr.daty) AND
	pre.mois_prev::integer BETWEEN 1 and $1
    AND pre.annee_prev::integer=$2
	

  GROUP BY 
   pre.annee_prev

  ORDER BY 
  	pre.annee_prev
  `

  const params = [mois,annee];

  Promise.all([
    db.query(fluxCentre, params),
    db.query(totalCentre, params),
    db.query(fluxCentreCumule, params),
    db.query(totalCentreCumule, params),
    db.query(fluxNature, params),
    db.query(totalNature, params),
    db.query(fluxNatureCumule, params),
    db.query(totalNatureCumule, params),
  ])
  .then(([fluxCentreRes,totalCentreRes,fluxCentreCumuleRes,totalCentreCumuleRes,fluxNatureRes,totalNatureRes,fluxNatureCumuleRes,totalNatureCumuleRes]) => {
    res.json({
      centres:fluxCentreRes.rows,
      totalCentre:totalCentreRes.rows[0],
      centresCumules:fluxCentreCumuleRes.rows,
      totalCentreCumule:totalCentreCumuleRes.rows[0],
      natures:fluxNatureRes.rows,
      totalNature:totalNatureRes.rows[0],
      naturesCumules:fluxNatureCumuleRes.rows,
      totalNatureCumule:totalCentreCumuleRes.rows[0]
    });
  })
  .catch(err => {
    console.error("Erreur SQL: ", err);
    res.status(500).json({ message: "Erreur pour récupérer les données du flux" });
  });
});



const port = 3001;

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
