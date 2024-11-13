import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

//css
import './Menu.css';

import photo from './images/avatarlogin.png';
import mef from './images/mef.jpg';
import ic_finance from './images/icon_finance.svg';
import ic_home from './images/icon_home.svg';
import ic_table from './images/icon_table.svg';
import { DataContext } from "./DataProvider";
import { useContext, useState } from "react";
import ModifLogin from "./components/ModifLogin";

import ic_screenshot from './images/ic_screenshot.svg';
import html2canvas from 'html2canvas';

function Menu() {
    const { user } = useContext(DataContext);
    console.log("user",user);

    const location = useLocation();
    const navigate = useNavigate();

    const scroll = {
        backgroundColor:'rgb(247,247,247)',
        height:'100%',
        color:'rgb(120,137,145)',
        fontFamily:'Inter'
    }

    const handleLogout = (e) => {
        e.preventDefault();
        // Supprimer le token du localStorage
        localStorage.removeItem('token');
      
        // Redirection vers la page de connexion
        navigate('/login');
    };


    //gestion modal
    const [showModifCount,setShowModifCount] = useState(false);
    
    const handleOnClickModif = (e) =>{
        e.preventDefault();
        setShowModifCount(true);
    }


    const handleCloseModifLogin = () => {
        setShowModifCount(false);
    }

    // const handleOnEditCount = (client) => {
    //     setDatamodif(client);
    //     setShowModifClient(true);
    // }

    const captureImage = () => {
        const element = document.getElementById('capture-section');
        html2canvas(element).then(function(canvas) {

            var a = document.createElement('a');
            a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg","image/octet-stream");
            a.download = 'modulestat.jpg';
            a.click();
        })
    }

    return (
        <div className="d-flex flex-row monmenu" style={{height:'100vh'}}>
            <ModifLogin show={showModifCount} onClose={handleCloseModifLogin}/>

            <div style={{backgroundColor:'rgb(255,87,51)',width:'20vw'}}>
                <div className="d-flex pt-4 ps-2 justify-content-start align-items-center">
                    <div style={{border:'1px solid white',borderRadius:'50%'}}>
                        <img alt="icon finance" src={ic_finance}/>    
                    </div>
                    <div id="jiramalabel" className="ms-2">
                        MEF/DGI
                    </div>
                </div>

                <div style={{textAlign:'center'}} className="mt-4">
                    <img alt="icon mef" src={mef} style={{height:'150px',width:'220px'}}/> 
                </div>
                    
                <div className="d-flex flex-column mt-4" style={{fontSize:'25px'}}>
                    <div className={location.pathname==='/' || location.pathname==='/piechart' || location.pathname==='/linechart' ? "menuactive p-3" : "menu p-3"} >
                        <div className="me-2">
                           <img alt="icon savings" src={ic_home}/>
                        </div>
                        <div>
                            <Link to="/" className="menuitem">Dashboard</Link>    
                        </div>
                    </div>
                    <div className={location.pathname==='/table' ? "menuactive p-3" : "menu p-3"} >
                        <div className="me-2">
                           <img alt="icon savings" src={ic_table}/>
                        </div>
                        <div>
                            <Link to="/table" className="menuitem">Table</Link>    
                        </div>
                    </div>
                </div>
                        
                     
            </div>

            <div className="d-flex flex-column" style={{width:'80vw'}}>
                <div className="d-flex justify-content-between p-1 align-items-center header" >
                    <div style={{cursor:'pointer'}} className="ms-3"><img src={ic_screenshot} alt="icon screenshot" onClick={captureImage}/></div>
                    <div className="d-flex align-items-center">
                        <div style={{paddingRight:'20px'}}>{user?.username}</div>
                        <div><img alt="" src={photo} style={{height:'50px',width:'70px',borderRadius:'25px'}}/></div>
                        <div className="dropdown">
                            <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown"></button>
                            <ul className="dropdown-menu">
                            <li><Link className="dropdown-item" onClick={handleOnClickModif}>Modifier le compte</Link></li>
                            <li><Link className="dropdown-item" onClick={handleLogout}>Se déconnecter</Link></li>
                            </ul>
                        </div>
                    </div>  
                </div>
               
                <div style={scroll} id="capture-section">
                    <Outlet/>
                </div>
            </div>

        </div>
    )
}

export default Menu;