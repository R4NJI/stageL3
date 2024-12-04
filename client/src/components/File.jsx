import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FenetreConfirmation from './FenetreConfirmation';
import ModifFile from './ModifFile';
import AjoutFile from './AjoutFile';
import { DataContext } from '../DataProvider';
import FenetreReussite from "./FenetreReussite";
import FenetreErreur from "./FenetreErreur";
import iconsearch from "../images/iconsearch.png"

function File() {
    //css
    const scroll = {
        maxHeight:'435px',
        overflowY:'auto',

    }

    const { fichier, fetchData } = useContext(DataContext);
    const [filteredFiles, setFilteredFiles] = useState(fichier);

    // console.log("ici fichier:",fichier)

    //variable pour controler l'apparition des modales
    const [confirm,setConfirm] = useState(false);
    const [showModifFile,setModifFile] = useState(false);
    const [showAjoutFile,setAjoutFile] = useState(false);


    const [param,setParam] = useState(0);
    const handleCloseConfirm = () => {
        setConfirm(false);
    }

    const hanleOnConfirm = () => {
       
        // Logique pour modifier le client ici
        axios.delete(`http://localhost:3001/api/file/${param}`)
         .then(res => {
             setShowModalSuccess(true);
         })
         .catch(err => {
             setMessage(err.response.data.message);
             setShowModalError(true);
        });

        setConfirm(false);
    }


    const handleCloseModifFile = () => {
        setModifFile(false)
    }

    const handleCloseAjoutFile = () => {
        setAjoutFile(false)
    }

    const handleDownload = (nomfichier) => {
        const fileUrl = `http://localhost:3001/api/file/${nomfichier}`;
        window.location.href = fileUrl; // Cette ligne redirige le navigateur vers l'URL pour télécharger le fichier
    };
    

    // Fonction pour formater la date au format français
    const formatDate = (date) => {
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        return new Date(date).toLocaleString('fr-FR', options).replace(/\//g, '/'); // Remplacer les '/' par des '-'
    }

    const [datamodif,setDatamodif] = useState({});

    const handleOnClickModifier =  (dataparam) => {
        // console.log("dataparam",dataparam)
        setDatamodif(dataparam);
        setModifFile(true);
    }

    const handleShowConfirm = (numerofichier) => {
        setConfirm(true);
        setParam(numerofichier);
    
    }

    // Fenêtre de réussite
    const [showModalSuccess, setShowModalSuccess] = useState(false);
    const handleCloseModalsSuccess = () => {
        setShowModalSuccess(false);
        fetchData();
    }

    // Fenêtre d'erreur
    const [message,setMessage] = useState("Modification du fichier échoué !");
    const [showModalError, setShowModalError] = useState(false);
    const handleCloseModalsError = () => {
        setShowModalError(false);
    }

    //pour la recherche
    const [search,setSearch] = useState("");
    const handleChangeSearch = (e) => {
        const {value} = e.target;
        setSearch(value);
    }


    useEffect(() => {
        const lesfichiers = fichier?.filter(f => 
            f.description.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredFiles(lesfichiers);
    }, [search, fichier]);

    return (
        <div className='d-flex flex-column m-4'>
            <div className='d-flex'>
                <div className='md-4 me-4'><button type='button' className='btn btn-info' onClick={()=>{setAjoutFile(true)}}><span>+</span> Ajouter un nouveau fichier</button></div>
                <div className="input-group input-group" style={{width:'430px'}}>
                    <span className="input-group-text"><img src={iconsearch} alt=''/></span>
                    <input id="email" className="form-control" placeholder="Rechercher un fichier" onChange={handleChangeSearch}/>
                </div>
            </div>


            <div className='d-flex table-responsive-xl mt-4' style={scroll}>
                <FenetreConfirmation
                    show={confirm}
                    titre="Suppression d'un fichier"
                    message="Êtes-vous sûre de supprimer ce fichier?"
                    onClose={handleCloseConfirm}
                    onConfirm={hanleOnConfirm}
                    danger="ok"
                />
                < ModifFile
                    show={showModifFile}
                    onClose={handleCloseModifFile}
                    datamodif={datamodif}
                />
                < AjoutFile
                    show={showAjoutFile}
                    onClose={handleCloseAjoutFile}
                />
                <FenetreReussite
                    show={showModalSuccess}
                    titre="Suppression du fichier réussie !"
                    onClose={handleCloseModalsSuccess}
                />
                <FenetreErreur
                    show={showModalError}
                    titre={message}
                    onClose={handleCloseModalsError}
                />
              
                <table className='table table-bordered ' style={{textAlign:'center'}}>
                    <thead>
                        <tr>
                            <th>Numéro</th>
                            <th>Description</th>
                            <th>Nom du fichier</th>
                            <th>Date de création</th>
                            <th colSpan='3'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredFiles?.map((f,index)=>(
                            <tr>
                                <td>{f.numerofichier}</td>
                                <td>{f.description}</td>
                                <td>{f.nomfichier}</td>
                                <td>{formatDate(f.datefichier)}</td>
                                <td><button type='button' className='btn btn-info' onClick={()=>handleDownload(f.nomfichier)}>Télécharger</button></td>
                                <td><button type='button' className='btn btn-secondary' onClick={()=>handleOnClickModifier(f)}>Modifier</button></td>
                                <td><button type='button' className='btn btn-danger' onClick={()=>handleShowConfirm(f.numerofichier)}>Supprimer</button></td>
                            </tr>
                            ))
                        }
           
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default File;
