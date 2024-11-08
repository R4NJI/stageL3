import { useEffect, useState } from "react";
import axios from "axios";

function Centre({data,mois0,scroll}) {
 
    //variable pour stocker le flux centre
    const [centres,setCentres] = useState([]);

    //variable pour stocker le flux centre total
    const [totalCentre,setTotalCentre] = useState(0);

    //variable pour stocker le flux centre cumule
    const [centresCumules,setCentresCumules] = useState([]);

    //variable pour stocker le flux centre cumule total
    const [totalCentreCumule,setTotalCentreCumule] = useState(0);

    //Paramétrer le moisDebut en fonction de moisFin
    useEffect(() => {
     console.log(data);
     axios.post('http://localhost:3001/api/flux', data)
     .then(response => {
       console.log('Résultats recues de lapi flux : ', response.data);
         setCentres(response.data.centres);
         setCentresCumules(response.data.centresCumules);
         setTotalCentre(response.data.totalCentre);
         setTotalCentreCumule(response.data.totalCentreCumule);
     })
     .catch(error => {
       console.error('Erreur lors du filtre : ', error);
     });
    }, [data]);

    return (
        <div className="table-responsive-xl" style={scroll}>
            <table className="table-bordered table-responsive" style={{fontFamily:'Roboto',textAlign:'center',fontSize:'13px',width:'100%'}}>
                <thead style={{color:'black'}}>
                    <tr>
                        <th rowSpan='2'>BUREAUX</th>
                        <th colSpan='3'>{mois0[parseInt(data.mois,10)-1]} {data.annee}</th>
                        <th colSpan='3'>Cumul</th>
                    </tr>
                    <tr >
                        <th >PREVISION</th>
                        <th>RECETTE</th>
                        <th>EXCEDENT</th>
                        <th>PREVISION</th>
                        <th>RECETTE</th>
                        <th>EXCEDENT</th>
                    </tr>
                </thead> 
                <tbody style={{color:'gray'}}>
                    { centres.map((centre,index)=> (
                        <tr key={index} >
                            <td>{centre.bureaux}</td>
                            <td>{centre.previsions}</td>
                            <td>{centre.recettes}</td>
                            <td>{  ((parseFloat(centre.recettes)/parseFloat(centre.previsions)) * 100).toFixed(2) } %</td>
                            <td>{centresCumules.find(cc=>(cc.code==centre.code)).previsions}</td>
                            <td>{centresCumules.find(cc=>(cc.code==centre.code)).recettes}</td>
                            <td>{ ((parseFloat(centresCumules.find(cc=>(cc.code==centre.code)).recettes)/parseFloat(centresCumules.find(cc=>(cc.code==centre.code)).previsions)) * 100).toFixed(2) } %</td>
                        
                        </tr>
                    )) }
                </tbody>
                <tfoot>
                    <tr style={{color:'white',backgroundColor:'rgb(120,137,145)'}}>
                        <td>Total</td>
                        <td>{totalCentre?.previsions}</td>
                        <td>{totalCentre?.recettes}</td>
                        <td>{  ((parseFloat(totalCentre?.recettes)/parseFloat(totalCentre?.previsions)) * 100).toFixed(2) } %</td>
                        <td>{totalCentreCumule?.previsions}</td>
                        <td>{totalCentreCumule?.previsions}</td>
                        <td>{  ((parseFloat(totalCentreCumule?.recettes)/parseFloat(totalCentreCumule?.previsions)) * 100).toFixed(2) } %</td>
                    </tr>
                </tfoot>
            
            </table>
        </div>
    )
}

export default Centre;