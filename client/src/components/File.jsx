import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FenetreConfirmation from './FenetreConfirmation';
import ModifFile from './ModifFile';
import AjoutFile from './AjoutFile';
import { DataContext } from '../DataProvider';

function File() {
    //css
    const scroll = {
        maxHeight:'435px',
        overflowY:'auto',

    }

    const { fichier } = useContext(DataContext);
    console.log("ici fichier:",fichier)

    //variable pour controler l'apparition des modales
    const [confirm,setConfirm] = useState(false);
    const [showModifFile,setModifFile] = useState(false);
    const [showAjoutFile,setAjoutFile] = useState(false);

    const handleCloseConfirm = () => {
        setConfirm(false);
    }

    const hanleOnConfirm = () => {
        alert("fichier supprimé");
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
    return (
        <div className='d-flex flex-column m-4'>
            <div className='md-4'><button type='button' className='btn btn-info' onClick={()=>{setAjoutFile(true)}}><span>+</span> Ajouter un nouveau fichier</button></div>


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
                />
                < AjoutFile
                    show={showAjoutFile}
                    onClose={handleCloseAjoutFile}
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
                            fichier?.map((f,index)=>(
                            <tr>
                                <td>{f.numerofichier}</td>
                                <td>{f.description}</td>
                                <td>{f.nomfichier}</td>
                                <td>{formatDate(f.datefichier)}</td>
                                <td><button type='button' className='btn btn-info' onClick={()=>handleDownload(f.nomfichier)}>Télécharger</button></td>
                                <td><button type='button' className='btn btn-secondary' onClick={()=>setModifFile(true)}>Modifier</button></td>
                                <td><button type='button' className='btn btn-danger' onClick={()=>setConfirm(true)}>Supprimer</button></td>
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
