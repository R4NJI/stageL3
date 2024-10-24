import { Outlet, Link, useLocation } from "react-router-dom";

//css
import './Menu.css';

import photo from './images/photo.jpg';
import mef from './images/mef.jpg';
import ic_finance from './images/icon_finance.svg';
import ic_home from './images/icon_home.svg';

function Menu() {
    const location = useLocation();

    const scroll = {
        backgroundColor:'rgb(247,247,247)',
        height:'100%',
        color:'rgb(120,137,145)',
        fontFamily:'Inter'
    }

    return (
        <div className="d-flex flex-row monmenu" style={{height:'100vh'}}>
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
                    <div className={location.pathname==='/' ? "menuactive p-3" : "menu p-3"} >
                        <div className="me-2">
                           <img alt="icon savings" src={ic_home}/>
                        </div>
                        <div>
                            <Link to="/" className="menuitem">RECETTE</Link>    
                        </div>
                    </div>
                    <div className={location.pathname==='/piechart' ? "menuactive p-3" : "menu p-3"} >
                        <div className="me-2">
                           <img alt="icon savings" src={ic_home}/>
                        </div>
                        <div>
                            <Link to="/piechart" className="menuitem">RECETTE 2</Link>    
                        </div>
                    </div>
                    <div className={location.pathname==='/linechart' ? "menuactive p-3" : "menu p-3"} >
                        <div className="me-2">
                           <img alt="icon savings" src={ic_home}/>
                        </div>
                        <div>
                            <Link to="/linechart" className="menuitem">RECETTE 3</Link>    
                        </div>
                    </div>
                </div>
                        
                     
            </div>

            <div className="d-flex flex-column" style={{width:'80vw'}}>
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