// DataProvider.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
const DataContext = createContext();

const DataProvider = ({ children }) => {
    const token = localStorage.getItem("token");

    //données api
    const [assujettis, setAssujettis] = useState(null);
    const [centre_gestionnaire, setCentre_gestionnaire] = useState(null);
    const [central_recette, setCentre_recette] = useState(null);
    const [prevision, setPrevision] = useState(null);
    const [user,setUser] = useState(null);
    const [users,setUsers] = useState(null);
    const [fichier,setFichier] = useState(null);
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(null);

    const fetchData = async () => {
        // alert("declenché");
        setLoading(true);
        setUser(JSON.parse(localStorage.getItem('user')))
        try {

            const headers = {
                Authorization: `Bearer ${token}`
            };
            
            const [assujettisResponse,central_recetteResponse,centre_gestionnaireResponse, previsionResponse,fichierResponse,usersResponse] = await axios.all([
                axios.get('http://localhost:3001/api/assujettis'),
                axios.get('http://localhost:3001/api/central_recette'),
                axios.get('http://localhost:3001/api/centre_gestionnaire'),
                axios.get('http://localhost:3001/api/prevision'),
                axios.get('http://localhost:3001/api/file'),
                axios.get('http://localhost:3001/api/users')
         
            ]);
            console.log("teste",assujettisResponse);
            setAssujettis(assujettisResponse.data.rows);
            setCentre_recette(central_recetteResponse.data.rows);
            setCentre_gestionnaire(centre_gestionnaireResponse.data.rows);
            setPrevision(previsionResponse.data.rows);
            setFichier(fichierResponse.data.rows);
            setUsers(usersResponse.data.rows);

        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <DataContext.Provider value={{ assujettis, central_recette, centre_gestionnaire ,token,user,users, prevision ,fichier,loading, error, fetchData }}>
            {children}
        </DataContext.Provider>
    );
};

export { DataProvider, DataContext };
