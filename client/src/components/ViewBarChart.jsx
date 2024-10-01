// src/components/ViewBarChart.js
import React from 'react';
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

const ViewBarChart = () => {
  // Données du graphique
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
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
