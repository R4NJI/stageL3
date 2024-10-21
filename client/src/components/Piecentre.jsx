import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function Piecentre({ recetteParBureau }) {
  let bureau = recetteParBureau.map(item => item.cg_abbrev);
  let recettes = recetteParBureau.map(item => item.total_ver);

  // Fonction pour générer un tableau de couleurs alternées
  const generateColors = (length, colors) => {
    let result = [];
    for (let i = 0; i < length; i++) {
      result.push(colors[i % colors.length]);
    }
    return result;
  };

  // Ajout de couleurs supplémentaires
  const colors = [
    'rgba(32,177,170, 2)',  // Turquoise
    'rgb(255,87,51)',       // Orange
    'rgba(128,0,128, 1)',   // Violet
    'rgba(128,128,128, 1)', // Gris
    'rgba(0,128,128, 1)',   // Bleu sarcelle
    'rgba(255,165,0, 1)',   // Orange fort
    'rgba(255,0,255, 1)',   // Magenta
    'rgba(75,0,130, 1)'     // Indigo
  ];

  const data = {
    labels: bureau,
    datasets: [
      {
        label: 'Recettes',
        data: recettes,
        backgroundColor: generateColors(bureau.length, colors), // Génère des couleurs alternées
        borderColor: generateColors(bureau.length, colors), // Génère des bordures alternées
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
      },
    },
  
  };

  return <Pie data={data} options={options} />;
}

export default Piecentre;