
import Filtre from './Filtre'
import { useEffect, useState } from "react";
import ViewBarChart from "./ViewBarChart";


import axios from 'axios';


function Graph() {
    
    const [data, setData] = useState({
        annee:"2010",
        moisDebut:"1",
        moisFin:"12",
        centre:"Tous",
        nature:"Tous"
    });

    const handleDataFilterChange = (newdata) => {
        setData(newdata);
    }


    const mois0 = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
      ];

   


    //variable pour stocker la recette totale cumulée du mois
    const [cumule,setCumule] = useState(0);
    //variable pour stocker la recette totale cumulée depuis janvier
    const [janvCumule,setJanvCumule] = useState(0);

    //variable pour stocker la recette de chaque mois
    const [recetteParMois,setRecetteParMois] = useState([])

    //variable pour stocker la prévision de chaque mois
    const [prevParMois,setPrevParMois] = useState([])

    //variable pour stocker le rang du cg
    const [rang,setRang] = useState([])

    //variable pour stocker la prévision totale
    const [somme_prevision,setSomme_totale] = useState([])


    //Paramétrer le moisDebut en fonction de moisFin
    useEffect(() => {
        axios.post('http://localhost:3001/api/recettes', data)
        .then(response => {
          console.log('Résultats recues de lapi recettes : ', response.data);
            setCumule(response.data.somme_totale);
            setRecetteParMois(response.data.recettes_par_mois);
            setPrevParMois(response.data.prevision);
            setJanvCumule(response.data.somme_cumule);
            setRang(response.data.rang_data);
            setSomme_totale(response.data.somme_prevision);
        })
        .catch(error => {
          console.error('Erreur lors du filtre : ', error);
        });
    }, [data]);



    return (
        
            <div>
                <div className="d-flex flex-column p-3">
                    <div style={{fontSize:'25px'}}>Tableau de Bord</div>
    
                    <div className="d-flex flex-column p-2 mt-3" style={{fontSize:'20px',backgroundColor:'white'}}>
                        
                        <Filtre handleDataFilterChange={handleDataFilterChange} data={data} mois0={mois0}/>

                        <div className="d-flex mt-3 justify-content-around" style={{width:'100%'}}>
                            <div className="d-flex flex-column" id="realisation">
                                <div>Réalisation cumulée</div>
                                <div style={{fontSize:'15px'}}>
                                    ({data.moisDebut == 1
                                        ? `Janvier` 
                                        :  `Janvier au ${mois0[parseInt(data.moisDebut, 10) - 1]}`                               
                                    } {data.annee})
                                </div>
                                <div className="mt-2">{janvCumule}</div>
                                <div className="mt-2">Réalisation du mois</div>
                                <div style={{fontSize:'15px'}}>
                                ({data.moisDebut === data.moisFin 
                                    ? mois0[parseInt(data.moisDebut, 10) - 1]
                                    : `${mois0[parseInt(data.moisDebut, 10) - 1]} au ${mois0[parseInt(data.moisFin, 10) - 1]}`} {data.annee})
                                </div>
                                <div className="mt-2">{cumule}</div>
                            </div>
                            <div id="barchart" className="d-flex justify-content-center" style={{width:'50%'}}>
                                <ViewBarChart moisDebut={data.moisDebut} moisFin={data.moisFin} recetteParMoisEnv={recetteParMois} prevParMoisEnv={prevParMois}/> 
                            </div>
                            <div className="d-flex flex-column">
                                <div>Rang du centre</div>
                                <div className="mb-3">{rang.find(r => r.code_bureau === data.centre)?.rang || 'Non trouvé'}</div>
                                <div>Excedent</div>
                                <div>{cumule-somme_prevision}</div>
                            </div>
                        </div>
                       
                    </div>
                </div>
            </div>
        
    )
}

export default Graph;