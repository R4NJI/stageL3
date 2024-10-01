function Linechart(params) {

    return (
        <div className="d-flex justify-content-around m-3" style={{backgroundColor:'white'}}>
            <div className="d-flex flex-column" id="realisation">
                <div>Réalisation cumulée</div>
                <div style={{fontSize:'15px'}}>(Janvier au Mai 2017)</div>
                <div className="mt-2">135 015 072</div>
                <div className="mt-2">Réalisation du mois</div>
                <div style={{fontSize:'15px'}}>(Mai 2017)</div>
                <div className="mt-2">135 015 072</div>
            </div>
            <div id="linechart">
                Linechart
            </div>
            <div className="d-flex flex-column">
                <div className="mb-3">Rang CF</div>
                <div>1er: SRE DIANA</div>
                <div>2ème: CF AMBALAVAO</div>
                <div>3ème: CF MAHAJANGA</div>
            </div>
        </div>
    )
}

export default Linechart;