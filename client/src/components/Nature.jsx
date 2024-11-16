import { useEffect, useState } from "react";
import axios from "axios";

function Nature({data,mois0,scroll,formatNumber}) {

    const [natures,setNatures] = useState([]);
    const [naturesCumules,setNaturesCumules] = useState([]);
    const [totalNature,setTotalNature] = useState(0);
    const [totalNatureCumule,setTotalNatureCumule] = useState(0);

   //Paramétrer le moisDebut en fonction de moisFin
   useEffect(() => {
    console.log(data);
    axios.post('http://localhost:3001/api/flux', data)
    .then(response => {
      console.log('Résultats recues de lapi flux : ', response.data);
        setNatures(response.data.natures);
        setNaturesCumules(response.data.naturesCumules);
        setTotalNature(response.data.totalNature);
        setTotalNatureCumule(response.data.totalNatureCumule);
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
                        <th rowSpan='2'>NATURE</th>
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
                <tbody style={{color:'gray',textAlign:'right'}}>
           
                    {
                        natures.map((nature,index)=> (
                           <tr key={index}>
                                <td style={{textAlign:'center'}}>{ nature.nature }</td>
                                <td>{ formatNumber(nature.previsions) }</td>
                                <td>{ formatNumber(nature.recettes) }</td>
                                <td>{ ((parseFloat(nature.recettes)/ parseFloat(nature.previsions)) * 100).toFixed(2) } %</td>
                                <td>{ formatNumber( naturesCumules.find(nc=>(nc.num_imp==nature.num_imp)).previsions ) }</td>
                                <td>{ formatNumber( naturesCumules.find(nc=>(nc.num_imp==nature.num_imp)).recettes ) }</td>
                                <td>{ ((parseFloat(naturesCumules.find(nc=>(nc.num_imp==nature.num_imp)).recettes)/ parseFloat(naturesCumules.find(nc=>(nc.num_imp==nature.num_imp)).previsions)) * 100).toFixed(2) } %</td>
                           </tr>     

                        ))

                    }
             
                </tbody>
                <tfoot style={{textAlign:'right'}}>
                    <tr style={{color:'white',backgroundColor:'rgb(120,137,145)'}}>
                        <td>Total</td>
                        <td>{totalNature? formatNumber(totalNature.previsions): ''}</td>
                        <td>{totalNature? formatNumber(totalNature.recettes): ''}</td>
                        <td>{ ((parseFloat(totalNature.recettes)/ parseFloat(totalNature.previsions)) * 100).toFixed(2) } %</td>
                        <td>{totalNatureCumule? formatNumber(totalNatureCumule.previsions): ''}</td>
                        <td>{totalNatureCumule? formatNumber(totalNatureCumule.recettes): ''}</td>
                        <td>{ ((parseFloat(totalNatureCumule.recettes)/ parseFloat(totalNatureCumule.previsions)) * 100).toFixed(2) } %</td>
                    </tr>
                </tfoot>
            
            </table>

        </div>
    )
}

export default Nature;