import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Plugin personnalisé pour ajouter du texte au centre du donut
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw(chart) {
    const { width, height, ctx } = chart;
    const percentage = Math.round((chart.data.datasets[0].data[0])); // Récupère le pourcentage actuel

    ctx.save();
    const fontSize = (height / 100).toFixed(2); // Taille de la police proportionnelle à la taille du donut
    ctx.font = `bold ${fontSize}em 'Roboto', sans-serif`;
    ctx.textBaseline = 'middle';

     ctx.fillStyle = 'rgb(120,137,145)';

    const text = `${percentage}%`;
    const textX = Math.round((width - ctx.measureText(text).width) / 2); // Centrer le texte horizontalement
    const textY = height / 2; // Centrer verticalement

    ctx.fillText(text, textX, textY); // Affiche le texte au centre
    ctx.restore();
  },
};

// Enregistrement du plugin dans Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ recette, prevision }) => {
  // Calcul du pourcentage
  let percentage = 0;

  if (parseInt(prevision) !== 0) {
    percentage = Math.round((recette / prevision) * 100);
  }

  const data = {
    labels: ['Recettes', 'Restant'],
    datasets: [
      {
        label: 'Budget',
        data: [percentage, 100 - percentage], // Remplit selon le pourcentage calculé
        backgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(211, 211, 211, 1)'], // Couleurs pour recettes et restant
        borderWidth: 1,
        cutout: '70%', // Taille du trou pour l'effet donut
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Pas besoin d'afficher la légende
      },
      centerTextPlugin,
    },
  };

  return <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />;
};

export default DonutChart;
