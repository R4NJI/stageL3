import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

import FenetreReussite from "./FenetreReussite";
import FenetreErreur from "./FenetreErreur";

import avatarlogin from '../../assets/images/avatarlogin.png';
import homme from '../../assets/images/homme.png';
import femme from '../../assets/images/femme.png';

import axios from 'axios';

function ModifClient({ show, onClose, client, compteurs, fetchData }) {
    // data modifier
    
    const [data, setData] = useState(client);
    useEffect(() => {
        setData(client);
    }, [client]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData(last => ({
            ...last,
            [name]: value
        }));
    }

    //trouver le compteur du client
    useEffect(() => {
        if (client.codecompteur) {
            const compteurInfo = findCompteurInfo(client.codecompteur);
            if (compteurInfo) {
                setData(last => ({
                    ...last,
                    type: compteurInfo.type,
                    pu: compteurInfo.pu
                }));
            }
        }
    }, [client.codecompteur]);

    const findCompteurInfo = (codecompteur) => {
        return compteurs.find(compteur => compteur.codecompteur === codecompteur);
    };

    // Soumission du formulaire
    const handleOnSubmit = (e) => {
        e.preventDefault();
        // Logique pour modifier le client ici
        axios.post(`http://localhost:3001/api/client`, data , {
            headers: {
                'Content-Type': 'application/json',
            },
            })
            .then(res => {
                setShowModalSuccess(true);
                fetchData();  // Rafraîchir les données
    
            })
            .catch(err => {
                setShowModalError(true);
                console.error("Erreur lors de la modification du client:", err)
        });
        
        
    }

    // Fenêtre de réussite
    const [showModalSuccess, setShowModalSuccess] = useState(false);
    const handleCloseModalsSuccess = () => {
        setShowModalSuccess(false);
        onClose();
    }

    // Fenêtre d'erreur
    const [showModalError, setShowModalError] = useState(false);
    const handleCloseModalsError = () => {
        setShowModalError(false);
    }

    
    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Modifier le client</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="modifClient" onSubmit={handleOnSubmit}>
                    <FenetreReussite
                        show={showModalSuccess}
                        titre="Modification du client réussie !"
                        onClose={handleCloseModalsSuccess}
                    />

                    <FenetreErreur
                        show={showModalError}
                        titre="Modification du client échouée !"
                        onClose={handleCloseModalsError}
                    />

                    <div className="d-flex justify-content-around align-items-center mb-4">
                        <div>
                            <img alt="icon avatar" src={avatarlogin} style={{ width: '120px', height: '80px' }} />
                        </div>

                        <div className="row w-100">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="codecli">Code client:</label>
                                <input value={data.codecli} required onChange={handleOnChange} type='text' name='codecli' id="codecli" className="form-control" />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="nom">Nom:</label>
                                <input value={data.nom} required onChange={handleOnChange} type='text' name='nom' id="nom" className="form-control" />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Sexe</label>
                                <div className="d-flex align-items-center">
                                    <input checked={data.sexe === "M"} type='radio' name="sexe" id="homme" value="M" onChange={handleOnChange} className="me-2" />
                                    <label htmlFor='homme' className="me-3"><img alt='icon homme' src={homme} /></label>
                                    <input checked={data.sexe === "F"} type='radio' name="sexe" id="femme" value="F" onChange={handleOnChange} className="me-2" />
                                    <label htmlFor='femme'><img alt='icon femme' src={femme} /></label>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="quartier">Quartier:</label>
                                <input value={data.quartier} required onChange={handleOnChange} type="text" name='quartier' id="quartier" className="form-control" />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="niveau">Niveau:</label>
                                <input value={data.niveau} required onChange={handleOnChange} type="text" name='niveau' id="niveau" className="form-control" />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="mail">Email:</label>
                                <input value={data.mail} required onChange={handleOnChange} type="email" name='mail' id="mail" className="form-control" />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="codecompteur">Code Compteur:</label>
                                <input value={data.codecompteur} required onChange={handleOnChange} type="text" name="codecompteur" id="codecompteur" className="form-control" />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="type">Type:</label>
                                <select name="type" id="type" onChange={handleOnChange} value={data.type} className="form-control">
                                    <option value="eau">Eau</option>
                                    <option value="electricite">Electricité</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="pu">Prix unitaire:</label>
                                <input value={data.pu} required onChange={handleOnChange} type="text" name='pu' id="pu" className="form-control" />
                            </div>
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

export default ModifClient;
