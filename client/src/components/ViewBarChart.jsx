// src/components/ViewBarChart.js
import React, { useContext, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ViewBarChart = ({ moisDebut, moisFin , recetteParMoisEnv, prevParMoisEnv }) => {
  const mois0 = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  //variable pour stocker les mois selectionne(janvier,fevrier,etc) sous forme de tableau
  const [mois,setMois] = useState([]);

  //variable pour stocker les recettes de chaque mois sous forme de tableau
  const [recetteParMois,setRecetteParMois] = useState([]);

  //variable pour stocker les prévisions de chaque mois sous forme de tableau
  const [prevParMois,setPrevParMois] = useState([]);

  useEffect(() => {
    // Convertir moisDebut et moisFin en nombres
    const debut = parseInt(moisDebut, 10); 
    const fin = parseInt(moisFin, 10);
    let mois1=[]

    // Vérifier si les valeurs sont valides
    if (!isNaN(debut) && !isNaN(fin) && debut >= 1 && fin <= 12 && debut <= fin) {
      for (let index = debut - 1; index < fin; index++) {
        mois1.push(mois0[index]); // Ajouter les mois dans le tableau
      }
      setMois(mois1);
      console.log("Mois sélectionnés : ", mois1); // Affiche les mois sélectionnés
    } else {
      console.error("Valeurs de moisDebut ou moisFin incorrectes");
    }


    // Initialiser un tableau de recettes et previsions avec 0 pour chaque mois
    let recettes = Array(fin - debut + 1).fill(0);
    let prevision = Array(fin - debut + 1).fill(0);

    // Mettre à jour les recettes par mois si les données sont reçues
    if (recetteParMoisEnv && recetteParMoisEnv.length > 0) {
      recetteParMoisEnv.forEach(item => {
        const moisIndex = item.mois - debut; // Trouver l'index correspondant au mois dans l'intervalle
        if (moisIndex >= 0 && moisIndex < recettes.length) {
          recettes[moisIndex] = item.somme_recettes; // Mettre à jour la recette pour le mois correspondant
        }
      });
      console.log("Recettes par mois : ", recettes); // Affiche les recettes reçues
    }

    // Mettre à jour les previsions par mois si les données sont reçues
    if (prevParMoisEnv && prevParMoisEnv.length > 0) {
      prevParMoisEnv.forEach(item => {
        const moisIndex = item.mois_prev - debut; // Trouver l'index correspondant au mois dans l'intervalle
        if (moisIndex >= 0 && moisIndex < prevision.length) {
          prevision[moisIndex] = item.somme_prevision; // Mettre à jour la recette pour le mois correspondant
        }
      });
      console.log("Prévision du mois : ", prevision); // Affiche les recettes reçues
    }

    setRecetteParMois(recettes); // Mettre à jour l'état avec les recettes
    setPrevParMois(prevision); // Mettre à jour l'état avec les prévisions

  }, [moisDebut, moisFin, recetteParMoisEnv, prevParMoisEnv]);

  // Données du graphique
  const data = {
    labels: mois,
    datasets: [
      {
        label: 'Recette',
        data: recetteParMois,
        backgroundColor: 'rgba(32,177,170, 2)', // Couleur des barres
        borderColor: 'rgba(75, 192, 192, 1)', // Couleur des bordures des barres
        borderWidth: 1,
      },
      {
        label: 'Prevision',
        data: prevParMois,
        backgroundColor: 'rgb(255,87,51)', // Couleur des barres
        borderColor: 'rgb(255,87,51)', // Couleur des bordures des barres
        borderWidth: 1,
      }
    ],
  };

  // Options du graphique
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Légende positionnée en haut
      },
      title: {
        display: true,
        text: 'Diagramme en baton',
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Début de l'axe Y à 0
        min: 0, // Valeur minimale de l'axe Y
        max: 9000000, // Valeur maximale de l'axe Y (ajuster selon tes données)
        ticks: {
          stepSize: 100, // Intervalle entre les graduations de l'axe Y
        },
      },
    },
  };

    return <Bar data={data} options={options} />;
 // return <div>View barchart</div>
};

export default ViewBarChart;
