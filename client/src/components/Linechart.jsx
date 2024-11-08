import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Nécessaire pour gérer le remplissage entre les lignes
);

const LineChart = ({ moisDebut, moisFin, recetteParMoisEnv, prevParMoisEnv }) => {
  const mois0 = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  // Variables d'état pour stocker les mois, recettes et prévisions
  const [mois, setMois] = useState([]);
  const [recetteParMois, setRecetteParMois] = useState([]);
  const [prevParMois, setPrevParMois] = useState([]);

  useEffect(() => {
    const debut = parseInt(moisDebut, 10); 
    const fin = parseInt(moisFin, 10);
    let mois1 = [];

    // Vérifie si les valeurs de moisDebut et moisFin sont valides
    if (!isNaN(debut) && !isNaN(fin) && debut >= 1 && fin <= 12 && debut <= fin) {
      for (let index = debut - 1; index < fin; index++) {
        mois1.push(mois0[index]); // Ajouter les mois sélectionnés
      }
      setMois(mois1);
    } else {
      console.error("Valeurs de moisDebut ou moisFin incorrectes");
    }

    let recettes = Array(fin - debut + 1).fill(0);
    let prevision = Array(fin - debut + 1).fill(0);

    // Mettre à jour les recettes et prévisions par mois
    if (recetteParMoisEnv && recetteParMoisEnv.length > 0) {
      recetteParMoisEnv.forEach(item => {
        const moisIndex = item.mois - debut;
        if (moisIndex >= 0 && moisIndex < recettes.length) {
          recettes[moisIndex] = item.somme_recettes;
        }
      });
    }

    if (prevParMoisEnv && prevParMoisEnv.length > 0) {
      prevParMoisEnv.forEach(item => {
        const moisIndex = item.mois_prev - debut;
        if (moisIndex >= 0 && moisIndex < prevision.length) {
          prevision[moisIndex] = item.somme_prevision;
        }
      });
    }

    setRecetteParMois(recettes);
    setPrevParMois(prevision);

  }, [moisDebut, moisFin, recetteParMoisEnv, prevParMoisEnv]);

  const data = {
    labels: mois,
    datasets: [
      {
        label: 'Recettes',
        data: recetteParMois,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Couleur de remplissage transparente
        tension: 0.4,
        fill: true, // Remplit l'espace entre la courbe "Recettes" et la courbe "Prévisions"
      },
      {
        label: 'Prévisions',
        data: prevParMois,
        borderColor: 'rgb(255,87,51)',          // Couleur de la bordure orange (valeurs RGB de l'orange)
        backgroundColor: 'rgba(255, 87, 51, 0.2)',
        tension: 0.4,
        fill: true, // Remplit l'espace entre la courbe "Prévisions" et l'axe Y=0
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Recettes et Prévisions (par mois)',
      },
    },
    scales: {
      y: {
        beginAtZero: true, // L'axe Y commence à 0
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
