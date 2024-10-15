import { useLocation } from "react-router-dom";
import ViewBarChart from "./ViewBarChart";

function Realisation({data,janvCumule,cumule,recetteParMois,prevParMois,rang,somme_prevision}) {
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
                { location.pathname==='/' ? 
                    <ViewBarChart moisDebut={data.moisDebut} moisFin={data.moisFin} recetteParMoisEnv={recetteParMois} prevParMoisEnv={prevParMois}/>
                    : 
                    <div>Graph</div>
                }
            </div>
            <div className="d-flex flex-column">
                <div>Rang du centre</div>
                <div className="mb-3">{rang.find(r => r.code_bureau === data.centre)?.rang || 'Non trouvé'}</div>
                <div>Excedent</div>
                <div>{cumule-somme_prevision}</div>
            </div>
        </div>
    )
}

export default Realisation;