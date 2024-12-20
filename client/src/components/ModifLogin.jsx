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

function ModifLogin({ show, onClose, datamodif }) {
    // data modifier
    const {user,fetchData } = useContext(DataContext);
    // console.log("datamodif:",datamodif);
    
    const [data, setData] = useState({
        id:'',
        username:'',
        lastpassword:'',
        password:'',
        droit:''
    });

    useEffect(()=> {
        // alert(datamodif.numerofichier)
        setData(last => ({
            ...last,
            id:datamodif?.id,
            droit:datamodif?.droit,
            username:datamodif?.username,
            lastpassword:'',
            password:''
        }));
    },[datamodif])


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
        axios.put(`http://localhost:3001/api/users`, data , {
            headers: {
                'Content-Type': 'application/json',
            },
            })
            .then(res => {
                if (data.id==user.id)
                    localStorage.setItem("user", JSON.stringify({id:data.id,username:data.username,droit:data.droit}));
                setShowModalSuccess(true);
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

    //pour la div de chaque champ
    const [isNameFocused, setIsNameFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isLastPasswordFocused, setIsLastPasswordFocused] = useState(false);
    

    const handleNameFocus = () => {
        setIsNameFocused(true);
    };

    const handleNameBlur = () => {
        setIsNameFocused(false);
    };

    const handlePasswordFocus = () => {
        setIsPasswordFocused(true);
    };

    const handlePasswordBlur = () => {
        setIsPasswordFocused(false);
    };

    const handleLastPasswordFocus = () => {
        setIsLastPasswordFocused(true);
    };

    const handleLastPasswordBlur = () => {
        setIsLastPasswordFocused(false);
    };

    //pour le mot de passe
    const [showpass, setShowpass] = useState(false);
    const handlePassClick = () => {
        setShowpass(prevvalue=>!prevvalue)
    }

    
    //pour le mot de passe
    const [showlastpass, setShowlastpass] = useState(false);
    const handleLastPassClick = () => {
        setShowlastpass(prevvalue=>!prevvalue)
    }
    
    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Modifier de l'utilisateur</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="modifLogin" onSubmit={handleOnSubmit}>
                    <FenetreReussite
                        show={showModalSuccess}
                        titre="Modification de l'utilisateur réussie !"
                        onClose={handleCloseModalsSuccess}
                    />

                    <FenetreErreur
                        show={showModalError}
                        titre={message}
                        onClose={handleCloseModalsError}
                    />

                    <div className="d-flex justify-content-center align-items-center mb-4">
                        <div className='me-4'>
                            <img alt="icon avatar" src={avatarlogin} style={{ width: '120px', height: '80px' }} />
                        </div>

                        <div className="d-flex flex-column ms-4">
                            <div className="d-flex">
                                <div className="col-md-6 mb-3 me-4">
                                    <label htmlFor="username" onClick={handleNameFocus}>Nom d'utilisateur:</label>
                                    <div className="d-flex flex-row form-control mb-3" style={isNameFocused? {border: '2px solid #87CEEB'} :{}}>
                                        <input style={{border:'none',outline:'none'}} type="text" name="username" id='username' value={data.username} onChange={handleOnChange} onFocus={handleNameFocus} onBlur={handleNameBlur} required/>
                                        <img src={iconuser} alt='iconuser'/>
                                    </div>
                                </div>
                                <div className='col-md-6 mb-3'>
                                    <label htmlFor='droit'>Droit:</label>
                                    <select className='form-select' name='droit' id='droit' onChange={handleOnChange} value={data.droit}>
                                        <option value='visiteur'>Visiteur</option>
                                        <option value='administrateur'>Administrateur</option>
                                    </select>
                                </div>
                            </div>

                            <div className='d-flex'>
                                <div className="col-md-6 mb-3 me-4">
                                    <label htmlFor="lastpassword" onClick={handleLastPasswordFocus}>Ancien mot de passe:</label>
                                    <div className="d-flex flex-row form-control" style={isLastPasswordFocused? {border: '2px solid #87CEEB'} :{}}>
                                        <input style={{border:'none',outline:'none'}} type={showlastpass?'text':'password'} name="lastpassword" value={data.lastpassword} onChange={handleOnChange} onFocus={handleLastPasswordFocus} onBlur={handleLastPasswordBlur} required/>
                                        <img style={{cursor:'pointer'}} src={showlastpass?iconeyeshow:iconeyeshide} alt='iconpass' onClick={handleLastPassClick}/>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="password">Mot de passe:</label>
                                    <div className="d-flex flex-row form-control" style={isPasswordFocused? {border: '2px solid #87CEEB'} :{}}>
                                        <input style={{border:'none',outline:'none'}} type={showpass?'text':'password'} name="password" value={data.password} onChange={handleOnChange} onFocus={handlePasswordFocus} onBlur={handlePasswordBlur}/>
                                        <img style={{cursor:'pointer'}} src={showpass?iconeyeshow:iconeyeshide} alt='iconpass' onClick={handlePassClick}/>
                                    </div>
                                </div>
                            </div>
                           
                        </div>
                    </div>

                    <div className="d-flex justify-content-center">
                        <button type='button' className='btn btn-secondary me-3' onClick={onClose}>Annuler</button>
                        <button type='submit' className='btn btn-info'>Confirmer</button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default ModifLogin;
