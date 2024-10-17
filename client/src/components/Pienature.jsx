import React, { useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { DataContext } from '../DataProvider';

ChartJS.register(ArcElement, Tooltip, Legend);

function Pienature({recetteParNature}) {
    // const {assujettis} = useContext(DataContext);
    // //variable pour stocker les abrev disponibles
    // let datarecette = recetteParNature.map(item => item.abrev);

    // //variable pour stocker tous les abrev
    // let natures = assujettis.map(item => item.abrev);

    // //variable pour stocker tous les recettes de chaque abrev et on initialise a 0
    // let num_imp = Array(natures.length).fill(0);
    // for (let i=0;i<natures.length;i++) {
    //   if ()
    // }

    let natures = recetteParNature.map(item => item.abrev);
    let recettes = recetteParNature.map(item => item.total_ver)

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
        labels: natures,
        datasets: [
          {
            label: 'Votes',
            data: recettes,
            backgroundColor: generateColors(natures.length, colors), // Génère des couleurs alternées
            borderColor: generateColors(natures.length, colors), // Génère des bordures alternées
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

      return (
    
          <Pie data={data} options={options}/>
        
      );
}

export default Pienature;