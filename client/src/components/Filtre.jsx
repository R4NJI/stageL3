import { useContext, useEffect, useState } from "react";
import { DataContext } from '../DataProvider';

function Filtre({handleDataFilterChange,data,mois0}) {
    
    const handleOnChange = (e) => {
        const { name, value } = e.target;

        const newData = { ...data, [name]: value };

        // Vérification supplémentaire pour ajuster `moisDebut` si nécessaire
        if (name === "moisFin" && parseInt(value, 10) < parseInt(data.moisDebut, 10)) {
            newData.moisDebut = value;
        }

        // Appeler la fonction pour mettre à jour les données dans le parent
        handleDataFilterChange(newData);
    };

    const { assujettis , centre_gestionnaire} = useContext(DataContext);

    //mois1
    const [mois1,setMois1] = useState([]);
    useEffect(()=> {
        const moisFinInt = parseInt(data.moisFin, 10); 
        setMois1(mois0.slice(0, moisFinInt)); 
    },[data.moisFin]);
    return (
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
    )
}

export default Filtre;