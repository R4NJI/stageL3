import { Outlet, Link, useLocation } from "react-router-dom";

import logojirama from '../../assets/images/logojirama.png';

//icon des menus
import iconclient from '../../assets/images/iconclient.png';
import iconclientactive from '../../assets/images/iconclientactive.png';
import iconpaiement from '../../assets/images/iconpaiement.png';
import iconpaiementactive from '../../assets/images/iconpaiementactive.png';
import iconreleve from '../../assets/images/iconreleve.png';
import iconreleveactive from '../../assets/images/iconreleveactive.png';

//photo header
import photo from '../../assets/images/photo.jpg';

//css
import './Menu.css';

function Menu() {
    const location = useLocation();

    const scroll = {
        maxHeight:'700px',
        overflowY:'auto',
        backgroundColor:'#EFF0F3',
    }

    return (
        <div className="d-flex flex-row monmenu" style={{height:'100vh'}}>
            <div className="col-2" style={{backgroundColor:'#0FABE8'}}>
                <div className="d-flex justify-content-center  align-items-center">
                    <div style={{paddingRight:'10px'}}>
                        <img alt="logo icon" src={logojirama}/>
                    </div>
                    <div id="jiramalabel">
                        JIRAMA
                    </div>
                </div>
                    
                <div className="d-flex flex-column p-4" style={{fontSize:'25px'}}>
                    <div  className="d-flex" >
                        <div>
                            <img className="icon" alt="icon menu client" src={location.pathname==='/menu' ? iconclientactive : iconclient}/>
                        </div>
                        <div>
                            <Link to="/menu" className={location.pathname==='/menu' ? "menuactive" : "menu"}>Espace client</Link>    
                        </div>
                    </div>
                    <div className="d-flex">
                        <div>
                            <img className="icon" alt="icon menu releve" src={location.pathname==='/menu/releve' ? iconreleveactive : iconreleve}/>
                        </div>
                        <div>
                            <Link to="/menu/releve" className={location.pathname==='/menu/releve' ? "menuactive" : "menu"}>Relevé</Link>
                        </div>
                    </div>
                    <div className="d-flex">
                        <div>
                            <img className="icon" alt="icon menu paiement" src={location.pathname==='/menu/paiement' ? iconpaiementactive :  iconpaiement}/>
                        </div>
                        <div>
                            <Link to="/menu/paiement" className={location.pathname==='/menu/paiement' ? "menuactive" : "menu"}>Paiement</Link>
                        </div>
                    </div>
                </div>
                        
                    
           
            </div>

            <div className="col-10 d-flex flex-column">
                <div className="d-flex justify-content-end p-1 align-items-center header" >
                    <div style={{paddingRight:'20px'}}>Toavina</div>
                    <div><img alt="" src={photo} style={{height:'50px',width:'50px',borderRadius:'25px'}}/></div>
                    <div className="dropdown">
                        <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown"></button>
                        <ul className="dropdown-menu">
                        <li><Link className="dropdown-item" to='/' >Se déconnecter</Link></li>
                        </ul>
                    </div>
                </div>
                <div style={scroll}>
                    <Outlet/>
                </div>
            </div>

        </div>
    )
}

export default Menu;