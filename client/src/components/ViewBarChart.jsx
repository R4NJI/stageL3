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

const ViewBarChart = ({ moisDebut, moisFin , recetteparmoisenv }) => {
  const mois0 = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const [mois,setMois] = useState([]);
  const [recetteparmois,setRecetteparmois] = useState([]);

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
  }, [moisDebut, moisFin]);

  // Données du graphique
  const data = {
    labels: mois,
    datasets: [
      {
        label: 'Dataset 1',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Couleur des barres
        borderColor: 'rgba(75, 192, 192, 1)', // Couleur des bordures des barres
        borderWidth: 1,
      },
      {
        label: 'Dataset 2',
        data: [22, 9, 13, 15, 12, 13],
        backgroundColor: 'rgba(153, 102, 255, 0.2)', // Deuxième jeu de données
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
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
        text: 'Bar Chart Example',
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Début de l'axe Y à 0
      },
    },
  };

    return <Bar data={data} options={options} />;
 // return <div>View barchart</div>
};

export default ViewBarChart;
