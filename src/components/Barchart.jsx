import ViewBarChart from "./ViewBarChart";

function Barchart() {

    const mycss = {
        color:'rgb(120,137,145)',
        fontFamily:'Inter'
    }

    return (
        <div>
            <div className="d-flex flex-column p-3" style={mycss}>
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
                                        <select className="form-select" name="annee" id="annee">
                                            <option value="2017">2017</option>
                                            <option value="2018">2018</option>
                                        </select>
                                    </div>
                                    <div className="mt-3">
                                        <select className="form-select" name="centre" id="centre">
                                            <option value="CF ALASORA">CF ALASORA</option>
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
                                        <select className="form-select" name="moisDebut" id="moisDebut">
                                            <option value="">Tous les mois</option>
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
                                    <div className="mt-3">
                                        <select className="form-select" name="nature" id="nature">
                                            <option value="IR">IR</option>
                                            <option value="IS">IS</option>
                                            <option value="IRSA">IRSA</option>
                                            <option value="TVA">TVA</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex">
                            
                                <div className="me-4"><label htmlFor="moisFin">au :</label></div>
                            
                                <div>
                                    <select className="form-select" name="moisFin" id="moisFin">
                                        <option value="">Tous les mois</option>
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
                    <div className="d-flex mt-3">
                        <div className="d-flex flex-column" id="realisation">
                            <div>Réalisation cumulée</div>
                            <div style={{fontSize:'15px'}}>(Janvier au Mai 2017)</div>
                            <div className="mt-2">135 015 072</div>
                            <div className="mt-2">Réalisation du mois</div>
                            <div style={{fontSize:'15px'}}>(Mai 2017)</div>
                            <div className="mt-2">135 015 072</div>
    
                        </div>
                        <div id="barchart">
                            <ViewBarChart/> 
                        </div>
                    </div>
                   
                </div>
            </div>
        </div>
    )
}

export default Barchart;