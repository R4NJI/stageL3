import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FenetreConfirmation from './FenetreConfirmation';
import AjoutLogin from './AjoutLogin';
import ModifLogin from './ModifLogin';
import { DataContext } from '../DataProvider';
import FenetreReussite from "./FenetreReussite";
import FenetreErreur from "./FenetreErreur";
import iconsearch from "../images/iconsearch.png"

function User() {
    //css
    const scroll = {
        maxHeight:'435px',
        overflowY:'auto',

    }

    // const { fichier, fetchData } = useContext(DataContext);
    // const [filteredFiles, setFilteredFiles] = useState(fichier);
    const { user, users , fetchData } = useContext(DataContext);
    const [filteredUsers, setFilteredUsers] = useState(users);

    // console.log("ici utilisateur:",users)

    //variable pour controler l'apparition des modales
    const [confirm,setConfirm] = useState(false);
    const [showModifFile,setModifFile] = useState(false);
    const [showModifUser,setModifUser] = useState(false);
    const [showAjoutUser,setAjoutUser] = useState(false);


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

    const handleCloseModifUser = () => {
        setModifUser(false)
    }

   

    const handleCloseAjoutUser = () => {
        setAjoutUser(false)
    }


    const [datamodif,setDatamodif] = useState({});

    const handleOnClickModifier =  (dataparam) => {
        // console.log("dataparam",dataparam)
        setDatamodif(dataparam);
        setModifUser(true);
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
    const [message,setMessage] = useState("Modification de l'utilisateur échoué !");
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
        const lesusers = users?.filter(u => 
            u.username.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredUsers(lesusers);
    }, [search, users]);

    return (
        <div className='d-flex flex-column m-4'>
            <div className='d-flex'>
                <div className='md-4 me-4'><button type='button' className='btn btn-info' onClick={()=>{setAjoutUser(true)}}><span>+</span> Ajouter un nouveau utilisateur</button></div>
                <div className="input-group input-group" style={{width:'430px'}}>
                    <span className="input-group-text"><img src={iconsearch} alt=''/></span>
                    <input id="email" className="form-control" placeholder="Rechercher un utilisateur" onChange={handleChangeSearch}/>
                </div>
            </div>


            <div className='d-flex table-responsive-xl mt-4' style={scroll}>
                <FenetreConfirmation
                    show={confirm}
                    titre="Suppression d'un utilisateur"
                    message="Êtes-vous sûre de supprimer cet utilisateur?"
                    onClose={handleCloseConfirm}
                    onConfirm={hanleOnConfirm}
                    danger="ok"
                />
                < ModifLogin
                    show={showModifUser}
                    onClose={handleCloseModifUser}
                    datamodif={datamodif}
                />
                < AjoutLogin
                    show={showAjoutUser}
                    onClose={handleCloseAjoutUser}
                />
                <FenetreReussite
                    show={showModalSuccess}
                    titre="Suppression de l'utilisateur réussie !"
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
                            <th>Identifiant</th>
                            <th>Nom d'utilisateur</th>
                            <th>Droit</th>
                            <th colSpan='3'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredUsers?.map((u,index)=>(
                            <tr>
                                <td>{u.id}</td>
                                <td>{u.username}</td>
                                <td>{u.droit}</td>
                                <td><button type='button' className='btn btn-secondary' onClick={()=>handleOnClickModifier(u)}>Modifier</button></td>
                                <td><button type='button' className='btn btn-danger' onClick={()=>handleShowConfirm(u.id)} disabled={user.id==u.id}>Supprimer</button></td>
                            </tr>
                            ))
                        }
           
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default User;
