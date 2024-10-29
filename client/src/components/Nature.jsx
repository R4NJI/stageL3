import { useEffect, useState } from "react";
import axios from "axios";

function Nature({data,mois0,scroll}) {

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
                <tbody>
           
                    {
                        natures.map((nature,index)=> (
                           <tr>
                                <td>{ nature.nature }</td>
                                <td>{ nature.previsions }</td>
                                <td>{ nature.recettes }</td>
                                <td>{ (parseFloat(nature.recettes)/ parseFloat(nature.previsions)) * 100 } %</td>
                                <td>{ naturesCumules.find(nc=>(nc.num_imp==nature.num_imp)).previsions }</td>
                                <td>{ naturesCumules.find(nc=>(nc.num_imp==nature.num_imp)).recettes }</td>
                                <td>{ (parseFloat(naturesCumules.find(nc=>(nc.num_imp==nature.num_imp)).recettes)/ parseFloat(naturesCumules.find(nc=>(nc.num_imp==nature.num_imp)).previsions)) * 100 } %</td>
                           </tr>     

                        ))

                    }
             
                </tbody>
                <tfoot>
                    <tr style={{color:'white',backgroundColor:'rgb(120,137,145)'}}>
                        <td>Total</td>
                        <td>{totalNature.previsions}</td>
                        <td>{totalNature.recettes}</td>
                        <td>{ (parseFloat(totalNature.recettes)/ parseFloat(totalNature.previsions)) * 100 } %</td>
                        <td>{totalNatureCumule.previsions}</td>
                        <td>{totalNatureCumule.recettes}</td>
                        <td>{ (parseFloat(totalNatureCumule.recettes)/ parseFloat(totalNatureCumule.previsions)) * 100 } %</td>
                   
                    </tr>
                </tfoot>
            
            </table>

        </div>
    )
}

export default Nature;