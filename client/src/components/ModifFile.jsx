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

function ModifFile({ show, onClose }) {
    // data modifier
    const { user, fetchData } = useContext(DataContext);
    
    const [data, setData] = useState({
        id:user?.id,
        description:'',
        lastpassword:'',
        password:''
    });


    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData(last => ({
            ...last,
            [name]: value
        }));
    }


    // Soumission du formulaire
    const handleOnSubmit = (e) => {
        e.preventDefault();
        console.log(data)
   
        // Logique pour modifier le client ici
        axios.put(`http://localhost:3001/api/user`, data , {
            headers: {
                'Content-Type': 'application/json',
            },
            })
            .then(res => {
                setShowModalSuccess(true);
                localStorage.setItem("user", JSON.stringify(data));
            })
            .catch(err => {
                console.error("Erreur lors de la modification du client:", err)
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
    const [message,setMessage] = useState("Modification du compte échouée !");
    const [showModalError, setShowModalError] = useState(false);
    const handleCloseModalsError = () => {
        setShowModalError(false);
    }

  
    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Modifier le fichier</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="modifFichier" onSubmit={handleOnSubmit}>
                    <FenetreReussite
                        show={showModalSuccess}
                        titre="Modification du fichier échouée !"
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
                        <input type="text" id='description' name='description'/>
                      </div>
                      <div>
                        <label htmlFor="chemin">Fichier:</label>
                        <input type="file" />
                      </div>
                    </div>

                    <div className="d-flex justify-content-center">
                        <button type='submit' className='btn btn-primary me-3'>Confirmer</button>
                        <button type='button' className='btn btn-secondary' onClick={onClose}>Annuler</button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default ModifFile;
