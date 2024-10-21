import { useLocation } from "react-router-dom";
import ViewBarChart from "./ViewBarChart";
import LineChart from "./Linechart";
import DonutChart from './Donnutchart';

function Realisation({data,janvCumule,cumule,recetteParMois,prevParMois,rang,somme_prevision,previsionCumule, centre_gestionnaire}) {
    const mois0 = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
      ];

    const location = useLocation();

    return (
        <div className="d-flex mt-3 justify-content-around" style={{width:'100%'}}>
            <div className="d-flex flex-column" id="realisation">
                <div>Réalisation cumulée</div>
                <div style={{fontSize:'15px'}}>
                    ({data.moisDebut == 1
                        ? `Janvier` 
                        :  `Janvier au ${mois0[parseInt(data.moisDebut, 10) - 1]}`                               
                    } {data.annee})
                </div>
                <div className="mt-2 mb-4">{janvCumule}</div>
                <div className="mt-4">Réalisation du mois</div>
                <div style={{fontSize:'15px'}}>
                ({data.moisDebut === data.moisFin 
                    ? mois0[parseInt(data.moisDebut, 10) - 1]
                    : `${mois0[parseInt(data.moisDebut, 10) - 1]} au ${mois0[parseInt(data.moisFin, 10) - 1]}`} {data.annee})
                </div>
                <div className="mt-2">{cumule}</div>
            
            </div>
            
            {  location.pathname==='/linechart' && (
                <div className="d-flex flex-column">
                    <div style={{width:'100px'}} className="mb-4 mt-3"> 
                        <DonutChart prevision={previsionCumule} recette={janvCumule}/>
                    </div>
                    <div style={{width:'100px'}} className="mt-3">
                        <DonutChart prevision={somme_prevision} recette={cumule}/>
                    </div>
                </div>
            )}
            
            <div id="barchart" className="d-flex justify-content-center" style={{width:'50%'}}>
                { location.pathname==='/' ? 
                    <ViewBarChart moisDebut={data.moisDebut} moisFin={data.moisFin} recetteParMoisEnv={recetteParMois} prevParMoisEnv={prevParMois}/>
                    : 
                    <LineChart moisDebut={data.moisDebut} moisFin={data.moisFin} recetteParMoisEnv={recetteParMois} prevParMoisEnv={prevParMois}/>
                }
            </div>
            
            <div className="d-flex flex-column">
            
                        {/* <div className="mb-3">{rang.find(r => r.code_bureau === data.centre)?.rang || 'Non trouvé'}</div> */}
                 
               
                    
                        <div>Rang des centres</div>
                        { rang.slice(0, 3).map((r, index) => {
                            const gestionnaire = centre_gestionnaire.find(cg => cg.code_bureau === r.code_bureau);
                            return (
                                <div>
                                    {index + 1} {index+1 == 1 ? `er` : `ème` }: {gestionnaire ? gestionnaire.cg_abbrev : 'Non trouvé'}
                                </div>
                            );
                        }) }
                 

               

              

                <div className="mt-3">Excedent</div>
                <div>{cumule-somme_prevision}</div>
            </div>
        </div>
    )
}

export default Realisation;