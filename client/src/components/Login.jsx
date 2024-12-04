
import logo from '../images/logojiramalogin.png';
import bgverre from '../images/bgverre.png';
import logodgi from '../images/batssif.jpg'
import avatarlogin from '../images/avatarlogin.png';
import unsee from '../images/unsee.png';
import see from '../images/see.png';
import './Login.css';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DataContext } from '../DataProvider';

import ModalError from "react-modal";

function Login() {

  const { fetchData } = useContext(DataContext);

  //  style du fond d'image
    const stylebg = {
        backgroundImage: `url(${logodgi})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100%',
        width: '100%',
        display:'flex'
    }

    //username et password
    const [showpass,setShowpass] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isNameFocused, setIsNameFocused] = useState(false);
    const [field,setField] = useState({
      username:"",
      password:""
    })

    const handleOnChange = (e) => {
      const {value,name} = e.target;
      setField(prevfield=>({...prevfield,[name]:value}));
  }


    //style du boutton
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);


     //lors de la soumission du formulaire

     const navigate = useNavigate();
     
     const handleOnSubmit = (e) => {
      e.preventDefault();

      axios.post('http://localhost:3001/api/login', field)
      .then(response => {
     
        const { token, user } = response.data;

        // Stocker le token dans le localStorage
        localStorage.setItem("token", token);

        // Stocker les informations de l'utilisateur dans le localStorage
        localStorage.setItem("user", JSON.stringify(user));
      
        // Stocker les informations de l'utilisateur dans le localStorage
        localStorage.setItem("pseudo", {pseudo:'gifuto'});
        fetchData();
      
     
        navigate("/");
      })
      .catch(error => {
        console.error('Erreur lors de la connexion : ', error);
        setError(error.response.data.message);
        setIsModalErrorOpen(true);
      });

     }


     //fenetre modale erreur
     const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
     const [error, setError] = useState("");

     const closeModalError = ()=> {
      setIsModalErrorOpen(false)
     }

    return (
        <div className="d-flex flex-row login" style={{ height: '100vh' }}> 
          <div  className="col-9 d-flex justify-content-center align-items-center" >
            <img src={logodgi} alt="logo dgi" style={{height:'100%',width:'100%'}} />
          </div>
    
          <div className="col-3 d-flex justify-content-around">
            <form method="post" onSubmit={handleOnSubmit}  className="d-flex flex-column justify-content-center">
              <div className=''>
                <img alt='avatar icon' src={avatarlogin} style={{height:'200px',width:'300px'}}/>
              </div>

              <div className='mt-5'>
                <label htmlFor="txtLogin" >Nom d'utilisateur :</label>
              </div>
              <div className='mt-2'>
                <div className='d-flex flex-row form-control justify-content-between align-items-center' style={isNameFocused?{border: '2px solid #F2742B'} :{}}>
                  <input  onChange={handleOnChange} style={{fontSize:'20px'}} type="text" name="username" id="username" onFocus={()=>setIsNameFocused(true)} onBlur={()=>setIsNameFocused(false)} required/>
                  <img alt='unsee icon' src={unsee} style={{visibility:'hidden'}} />
                </div>
              </div>
              <div className='mt-2'>
                <label htmlFor="txtPassword">Mot de passe :</label>
              </div>
              <div className='mt-2'>
                <div className='d-flex flex-row form-control justify-content-between align-items-center' style={isPasswordFocused?{border: '2px solid #F2742B'} :{}}>
                  <input onChange={handleOnChange}  style={{fontSize:'20px'}}  type={showpass?'text':'password'} name="password" id="password" onFocus={()=>setIsPasswordFocused(true)} onBlur={()=>setIsPasswordFocused(false)} required/>
                  <img alt='password icon' src={showpass?see:unsee} style={{cursor:'pointer'}} onClick={()=>setShowpass(prevvalue=>!prevvalue)}/>
                </div>
              </div>
              <div className='mt-5 d-flex justify-content-center'>
                <button type="submit" className='btn' style={{ backgroundColor: isClicked ? '#FF6347' : (isHovered ? '#FFA07A' : '#F2742B'),fontSize:'30px',color:'white',fontWeight:'bold' }} onMouseOver={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)} onClick={()=> setIsClicked(true)} onMouseUp={()=> setIsClicked(false)}>Se connecter</button> 
              </div>
            </form>

            <ModalError
                isOpen={isModalErrorOpen}
                onRequestClose={closeModalError}
                contentLabel="Erreur de connexion"
                overlayClassName="overlay"
                className="modalError"
            >
            <div className="modal-content">
                <h2>Erreur</h2>
                <p>{error}</p>
                <button onClick={closeModalError} className="close-button">Fermer</button>
              </div>
            </ModalError>



          </div>
        </div>
      );
}

export default Login;