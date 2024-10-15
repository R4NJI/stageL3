import Piecentre from "./Piecentre";
import Pienature from "./Pienature";
import Filtre from "./Filtre";
import { useState } from "react";


function Piechart() {
    const mycss = {
        backgroundColor:'white'
    }

    return (
        <div className="d-flex justify-content-around "> 
            <div className="d-flex flex-column mt-4" style={mycss}>
                <div style={{borderBottom:'2px solid rgb(232,232,234)'}} className="mb-2">RECETTE PAR NATURE D'IMPOT</div>
                <div><Pienature/></div>
            </div>
            
            <div className="d-flex flex-column mt-4" style={mycss}>
                <div style={{borderBottom:'2px solid rgb(232,232,234)'}}>RECETTE PAR CENTRE OPERATIONNEL</div>
                <div></div>
            </div>
            
            <div className="d-flex flex-column mt-4" style={mycss}>
                <div style={{borderBottom:'2px solid rgb(232,232,234)',fontFamily:'Roboto'}}>Choix de centre à afficher</div>
                <div><input type="checkbox"/>CF ALASORA</div>
            </div>
        </div>

      
    )
}

export default Piechart;