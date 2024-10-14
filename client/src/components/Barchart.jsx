import { useContext, useEffect, useState } from "react";
import ViewBarChart from "./ViewBarChart";

import { DataContext } from '../DataProvider';
import axios from 'axios';

function Barchart() {
    const mois0 = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
      ];

    const { assujettis , centre_gestionnaire} = useContext(DataContext);

   //objet à envoyer
   const [data, setData] = useState({
        annee:"2010",
        moisDebut:"1",
        moisFin:"12",
        centre:"Tous",
        nature:"Tous"
    });

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

    const handleOnChange = (e) => {
        const { name, value } = e.target;
      
        setData(last => {
          let newData = { ...last, [name]: value }; 
      
          // Si moisFin est mis à jour et est inférieur à moisDebut, forcer moisDebut à suivre moisFin
          if (name === "moisFin" && parseInt(value, 10) < parseInt(last.moisDebut, 10)) {
            newData.moisDebut = value;
          }
      
          return newData;
        });
    };

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


    //mois1
    const [mois1,setMois1] = useState([]);
    useEffect(()=> {
        const moisFinInt = parseInt(data.moisFin, 10); 
        setMois1(mois0.slice(0, moisFinInt)); 
    },[data.moisFin]);

    return (
        <div>
            <div className="d-flex flex-column p-3">
                <div style={{fontSize:'25px'}}>Tableau de Bord</div>

                <div className="d-flex flex-column p-2 mt-3" style={{fontSize:'20px',backgroundColor:'white'}}>
                    
                    <div className="d-flex flex-column " >
        
                        <div style={{fontWeight:'20px'}}>Critère de recherche</div>
                        
                        <div className="d-flex justify-content-between mt-2 pt-3 pb-3" style={{borderTop:'2px solid rgb(232,232,234)',borderBottom:'2px solid rgb(232,232,234)',fontWeight:'bold',fontSize:'15px',fontFamily:'Roboto'}}>
                            <div className="d-flex">
                                <div className="d-flex flex-column me-4">
                                    <div><label htmlFor="annee">Année</label></div>
                                    <div style={{marginTop:'33px'}}><label htmlFor="centre">Centre opérationnel</label></div>
                                </div>
                                <div className="d-flex flex-column">
                                    <div>
                                        {/* /<input value={data.annee} onChange={handleOnChange} className="form-control" type="number" min="2010" max="2023" name="annee" id="annee" /> */}
                                        <select className="form-select" value={data.annee} onChange={handleOnChange} name="annee" id="annee">
                                            <option value="2010">2010</option>
                                            <option value="2011">2011</option>
                                            <option value="2012">2012</option>
                                            <option value="2013">2013</option>
                                            <option value="2014">2014</option>
                                            <option value="2015">2015</option>
                                            <option value="2016">2016</option>
                                            <option value="2017">2017</option>
                                            <option value="2018">2018</option>
                                            <option value="2019">2019</option>
                                            <option value="2020">2020</option>
                                            <option value="2021">2021</option>
                                            <option value="2022">2022</option>
                                            <option value="2023">2023</option>
                                        </select>
                                    </div>
                                    <div className="mt-3">
                                        <select className="form-select" name="centre" id="centre" value={data.centre} onChange={handleOnChange}>
                                            <option key="0" value="Tous">--Tous--</option>
                                            {centre_gestionnaire?.map((cg,index)=> (
                                                <option key={index} value={cg.id_centre_gest}>{cg.cg_abbrev}</option>
                                            ))
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="d-flex">
                                <div className="d-flex flex-column me-4">
                                    <div><label htmlFor="moisDebut">Mois de :</label></div>
                                    <div style={{marginTop:'33px'}}><label htmlFor="nature">Nature d'impôt</label></div>
                                </div>
                                <div className="d-flex flex-column">
                                    <div>
                                        <select className="form-select" name="moisDebut" id="moisDebut" value={data.moisDebut} onChange={handleOnChange}> 
                                            {
                                                mois1.map((lemois1,index)=>(
                                                    <option value={parseInt(index,10)+1}>{lemois1}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="mt-3">
                                        <select className="form-select" name="nature" id="nature" onChange={handleOnChange}>
                                            <option value="Tous">--Tous--</option>
                                            { assujettis?.map((assujetti,index) => (
                                                <option key={index} value={assujetti.num_imp}> {assujetti.abrev} </option>
                                            ) ) }
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex">
                                <div className="me-4"><label htmlFor="moisFin">au :</label></div>
                                <div>
                                        <select className="form-select" name="moisFin" id="moisFin" value={data.moisFin} onChange={handleOnChange}>
                                            <option value="1">Janvier</option>
                                            <option value="2">Février</option>
                                            <option value="3">Mars</option>
                                            <option value="4">Avril</option>
                                            <option value="5">Mai</option>
                                            <option value="6">Juin</option>
                                            <option value="7">Juillet</option>
                                            <option value="8">Août</option>
                                            <option value="9">Septembre</option>
                                            <option value="10">Octobre</option>
                                            <option value="11">Novembre</option>
                                            <option value="12">Décembre</option>
                                        </select>
                              
                                 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex mt-3 justify-content-around" style={{width:'100%'}}>
                        <div className="d-flex flex-column" id="realisation">
                            <div>Réalisation cumulée</div>
                            <div style={{fontSize:'15px'}}>
                                ({data.moisDebut == 1
                                    ? `Janvier` 
                                    :  `Janvier au ${mois0[parseInt(data.moisDebut, 10) - 1]}`                               
                                })
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

export default Barchart;