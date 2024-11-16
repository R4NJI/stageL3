import { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

import FenetreReussite from "./FenetreReussite";
import FenetreErreur from "./FenetreErreur";

import avatarlogin from '../images/avatarlogin.png';
import iconeyeshide from '../images/iconeyeshide.png';
import iconeyeshow from '../images/iconeyeshow.png';
import iconuser from '../images/iconuser.png';

import axios from 'axios';
import { DataContext } from '../DataProvider';

function ModifFile({ show, onClose, datamodif }) {
    // data modifier
    const { user, fetchData } = useContext(DataContext);
    
    const [data, setData] = useState({
        numerofichier:datamodif?.numerofichier,
        description:datamodif?.description || "",
        fichier:null
    });

    useEffect(()=> {
        // alert(datamodif.numerofichier)
        setData(last => ({
            ...last,
            numerofichier:datamodif.numerofichier,
            description:datamodif.description
        }));
    },[datamodif])


    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData(last => ({
            ...last,
            [name]: value
        }));
    }

        //l'event quand un fichier est selectionné
        const handleFileChange = (event) => {
            if (event.target.files && event.target.files.length > 0) {
                setData(prevdata=> ({...prevdata,fichier:event.target.files[0]}))
            }
        };


    // Soumission du formulaire
    const handleOnSubmit = (e) => {

        e.preventDefault();
        
        const formData = new FormData();
        formData.append('numerofichier', data.numerofichier);
        formData.append('description', data.description);
        formData.append('fichier', data.fichier);

        // Logique pour modifier le client ici
        axios.put(`http://localhost:3001/api/file`, formData , {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            })
            .then(res => {
                setShowModalSuccess(true);
            })
            .catch(err => {
                setMessage(err.response.data.message);
                setShowModalError(true);
        });
        
        
    }

    // Fenêtre de réussite
    const [showModalSuccess, setShowModalSuccess] = useState(false);
    const handleCloseModalsSuccess = () => {
        setShowModalSuccess(false);
        onClose();
        fetchData();
    }

    // Fenêtre d'erreur
    const [message,setMessage] = useState("Modification du fichier échoué !");
    const [showModalError, setShowModalError] = useState(false);
    const handleCloseModalsError = () => {
        setShowModalError(false);
    }

  
    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Modifier un fichier</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="modifFichier" encType="multipart/form-data" onSubmit={handleOnSubmit}>
                    <FenetreReussite
                        show={showModalSuccess}
                        titre="Modification du fichier réussi !"
                        onClose={handleCloseModalsSuccess}
                    />

                    <FenetreErreur
                        show={showModalError}
                        titre={message}
                        onClose={handleCloseModalsError}
                    />

                    <div className="d-flex justify-content-center align-items-center mb-4">
                      <div className='me-4'>
                        <label htmlFor="description">Description:</label>
                        <input type="text" id='description' name='description' value={data.description} onChange={handleOnChange} required/>
                      </div>
                      <div>
                        <label htmlFor="fichier">Fichier:</label>
                        <input type="file" id='fichier' onChange={handleFileChange}/>
                      </div>
                    </div>

                    <div className="d-flex justify-content-center">
                        <button type='submit' className='btn btn-info me-3'>Confirmer</button>
                        <button type='button' className='btn btn-secondary' onClick={onClose}>Annuler</button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default ModifFile;
