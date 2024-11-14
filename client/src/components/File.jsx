import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FenetreConfirmation from './FenetreConfirmation';
import ModifFile from './ModifFile';
import AjoutFile from './AjoutFile';

function File() {
    //css
    const scroll = {
        maxHeight:'435px',
        overflowY:'auto',

    }

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
                            <th>Chemin</th>
                            <th colSpan='3'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Recette et prévision du mois de janvier 2010</td>
                            <td>/lien/lien</td>
                            <td><button type='button' className='btn btn-info'>Télécharger</button></td>
                            <td><button type='button' className='btn btn-secondary' onClick={()=>setModifFile(true)}>Modifier</button></td>
                            <td><button type='button' className='btn btn-danger' onClick={()=>setConfirm(true)}>Supprimer</button></td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Recette et prévision du mois de janvier 2010</td>
                            <td>/lien/lien</td>
                            <td><button type='button' className='btn btn-info'>Télécharger</button></td>
                            <td><button type='button' className='btn btn-secondary'>Modifier</button></td>
                            <td><button type='button' className='btn btn-danger'>Supprimer</button></td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Recette et prévision du mois de janvier 2010</td>
                            <td>/lien/lien</td>
                            <td><button type='button' className='btn btn-info'>Télécharger</button></td>
                            <td><button type='button' className='btn btn-secondary'>Modifier</button></td>
                            <td><button type='button' className='btn btn-danger'>Supprimer</button></td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Recette et prévision du mois de janvier 2010</td>
                            <td>/lien/lien</td>
                            <td><button type='button' className='btn btn-info'>Télécharger</button></td>
                            <td><button type='button' className='btn btn-secondary'>Modifier</button></td>
                            <td><button type='button' className='btn btn-danger'>Supprimer</button></td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Recette et prévision du mois de janvier 2010</td>
                            <td>/lien/lien</td>
                            <td><button type='button' className='btn btn-info'>Télécharger</button></td>
                            <td><button type='button' className='btn btn-secondary'>Modifier</button></td>
                            <td><button type='button' className='btn btn-danger'>Supprimer</button></td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Recette et prévision du mois de janvier 2010</td>
                            <td>/lien/lien</td>
                            <td><button type='button' className='btn btn-info'>Télécharger</button></td>
                            <td><button type='button' className='btn btn-secondary'>Modifier</button></td>
                            <td><button type='button' className='btn btn-danger'>Supprimer</button></td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Recette et prévision du mois de janvier 2010</td>
                            <td>/lien/lien</td>
                            <td><button type='button' className='btn btn-info'>Télécharger</button></td>
                            <td><button type='button' className='btn btn-secondary'>Modifier</button></td>
                            <td><button type='button' className='btn btn-danger'>Supprimer</button></td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Recette et prévision du mois de janvier 2010</td>
                            <td>/lien/lien</td>
                            <td><button type='button' className='btn btn-info'>Télécharger</button></td>
                            <td><button type='button' className='btn btn-secondary'>Modifier</button></td>
                            <td><button type='button' className='btn btn-danger'>Supprimer</button></td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Recette et prévision du mois de janvier 2010</td>
                            <td>/lien/lien</td>
                            <td><button type='button' className='btn btn-info'>Télécharger</button></td>
                            <td><button type='button' className='btn btn-secondary'>Modifier</button></td>
                            <td><button type='button' className='btn btn-danger'>Supprimer</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default File;
