import { useState } from "react";
import Centre from "./Centre";
import { Link } from "react-router-dom";
import Nature from "./Nature";
import axios from "axios";
import * as XLSX from "xlsx";
import ic_export from '../images/ic_export.svg'

function Table() {
    //objet à envoyer

    const mois0 = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
      ];    
      const scroll = {
        maxHeight:'310px',
        overflowY:'auto',
        height:'325px'
    }

   const [data, setData] = useState({
        annee:"2010",
        mois:"1"
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;
      
        setData(last => {
          let newData = { ...last, [name]: value };   
          return newData;
        });
    };

    const [page,setPage] = useState(1);

    function formatNumber(number) {
        // Convertir le nombre en chaîne et séparer la partie entière et la partie décimale
        let [integerPart, decimalPart] = number.toString().split('.');
    
        // Ajouter un séparateur de milliers (utilisation d'une regex)
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
        // Ajouter la partie décimale si elle existe
        if (decimalPart) {
            return `${integerPart},${decimalPart}`;
        } else {
            return integerPart;
        }
    }

    const handleExportBureau = () => {
        axios.post('http://localhost:3001/api/flux', data)
        .then(response => {
            const centres = response.data.centres;
            const centresCumules = response.data.centresCumules;
            const totalCentre = response.data.totalCentre;
            const totalCentreCumule = response.data.totalCentreCumule;
            const rows = [];

            // Ajouter l'en-tête
            rows.push([
              "BUREAUX",
              `PREVISION`,
              `RECETTE`,
              `TAUX DE REALISATION`,
              "PREVISION CUMULEE",
              "RECETTE CUMULEE",
              "TAUX DE REALISATION CUMULE" ,
            ]);
        
            // Ajouter les lignes des bureaux
            centres.forEach((centre) => {
              const cumul = centresCumules.find((cc) => cc.code === centre.code);
              rows.push([
                formatNumber(centre.bureaux),
                formatNumber(centre.previsions),
                formatNumber(centre.recettes),
                ((parseFloat(centre.recettes) / parseFloat(centre.previsions)) * 100).toFixed(2) + " %",
                formatNumber(cumul?.previsions || 0),
                formatNumber(cumul?.recettes || 0),
                cumul
                  ? ((parseFloat(cumul.recettes) / parseFloat(cumul.previsions)) * 100).toFixed(2) + " %"
                  : "",
              ]);
            });
        
            // Ajouter le total
            rows.push([
              "Total",
              totalCentre ? formatNumber(totalCentre.previsions) : "",
              totalCentre ? formatNumber(totalCentre.recettes) : "",
              totalCentre
                ? ((parseFloat(totalCentre.recettes) / parseFloat(totalCentre.previsions)) * 100).toFixed(2) + " %"
                : "",
              totalCentreCumule ? formatNumber(totalCentreCumule.previsions) : "",
              totalCentreCumule ? formatNumber(totalCentreCumule.recettes) : "",
              totalCentreCumule
                ? ((parseFloat(totalCentreCumule.recettes) / parseFloat(totalCentreCumule.previsions)) * 100).toFixed(2) + " %"
                : "",
            ]);
        
            // Créer une feuille Excel
            const worksheet = XLSX.utils.aoa_to_sheet(rows);
        
            // Créer un classeur Excel
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, `Bilan des bureaux`);
        
            // Télécharger le fichier Excel
            XLSX.writeFile(workbook, `bilan_bureau_du_${mois0[parseInt(data.mois,10)-1]}_${data.annee}.xlsx`);

            
        })
        .catch(error => {
          console.error('Erreur lors du filtre : ', error);
        });
    }

    const handleExportImpot = () => {
        axios.post('http://localhost:3001/api/flux', data)
        .then(response => {
          console.log('Résultats recues de lapi flux : ', response.data);
            const natures = response.data.natures;
            const naturesCumules = response.data.naturesCumules;
            const totalNature = response.data.totalNature;
            const totalNatureCumule = response.data.totalNatureCumule;

        // Construire les données pour Excel
        const rows = [];

        // Ajouter l'en-tête
        rows.push([
        "NATURE",
        `PREVISION`,
        `RECETTE`,
        `TAUX DE REALISATION`,
        "PREVISION CUMULEE",
        "RECETTE CUMULEE",
        "TAUX DE REALISATION CUMULEE",
        ]);

        // Ajouter les lignes des données
        natures.forEach((nature) => {
        const cumule = naturesCumules.find((nc) => nc.num_imp === nature.num_imp);
        rows.push([
            nature.nature,
            nature.previsions,
            nature.recettes,
            ((parseFloat(nature.recettes) / parseFloat(nature.previsions)) * 100).toFixed(2) + " %",
            cumule?.previsions || "",
            cumule?.recettes || "",
            cumule
            ? ((parseFloat(cumule.recettes) / parseFloat(cumule.previsions)) * 100).toFixed(2) + " %"
            : "",
        ]);
        });

        // Ajouter le pied de tableau (totaux)
        rows.push([
        "Total",
        totalNature ? totalNature.previsions : "",
        totalNature ? totalNature.recettes : "",
        totalNature
            ? ((parseFloat(totalNature.recettes) / parseFloat(totalNature.previsions)) * 100).toFixed(2) + " %"
            : "",
        totalNatureCumule ? totalNatureCumule.previsions : "",
        totalNatureCumule ? totalNatureCumule.recettes : "",
        totalNatureCumule
            ? ((parseFloat(totalNatureCumule.recettes) / parseFloat(totalNatureCumule.previsions)) * 100).toFixed(2) + " %"
            : "",
        ]);

        // Créer une feuille Excel
        const worksheet = XLSX.utils.aoa_to_sheet(rows);

        // Créer un classeur Excel
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Données");

        // Télécharger le fichier Excel
        XLSX.writeFile(workbook, `bilan_impot_du_${mois0[parseInt(data.mois, 10) - 1]}_${data.annee}.xlsx`);


        })
        .catch(error => {
          console.error('Erreur lors du filtre : ', error);
        });
    } 



    return (
        <div className="d-flex flex-column m-4 p-4" style={{backgroundColor:'white'}}>
            <div style={{textAlign:'center',fontWeight:'bold'}} className="mb-3">BILAN PAR { page==1 ? `BUREAU` : `IMPOT` } </div>
            <div style={{textAlign:'center',fontFamily:'Roboto'}} className="mb-3">Mois de {mois0[parseInt(data.mois,10)-1]} {data.annee}</div>
            <div className="d-flex mb-4" style={{fontFamily:'Roboto'}}>
                <div className="me-3"><label htmlFor="mois">Mois :</label></div>
                <div className="me-3">
                    <select className="form-select" name="mois" id="mois" value={data.mois} onChange={handleOnChange}>
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
               
                <div className="me-3"><label htmlFor="annee">Année :</label></div>
                <div className="me-3">
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

                <div>
                    <button type='button' className='btn btn-sm btn-secondary' onClick={page == 1 ? handleExportBureau : handleExportImpot }>Exporter <img src={ic_export} alt="icon export"/></button>
                </div>
            </div>

            { page == 1 ? <Centre data={data} mois0={mois0} scroll={scroll} formatNumber={formatNumber}/> : <Nature data={data} mois0={mois0} scroll={scroll} formatNumber={formatNumber}/>}

            <div style={{width:'100%',textAlign:'center',fontSize:'20px'}}>
                        Page:&nbsp;
                        <span onClick={()=>setPage(1)}  className={page==1 ? "pageactive" : "page"}>1</span>&nbsp;
                        <span onClick={()=>setPage(2)}  className={page==2 ? "pageactive" : "page"}>2</span>&nbsp;
            </div>


        </div>
    )
}

export default Table;