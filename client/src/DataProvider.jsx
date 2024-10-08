// DataProvider.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext();

const DataProvider = ({ children }) => {

    //données api
    const [assujettis, setAssujettis] = useState(null);
    const [centre_fiscal, setCentre_fiscal] = useState(null);
    const [centre_gestionnaire, setCentre_gestionnaire] = useState(null);
    const [central_recette, setCentre_recette] = useState(null);
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [assujettisResponse,central_recetteResponse,centre_gestionnaireResponse,centre_fiscalResponse] = await axios.all([
                axios.get('http://localhost:3001/api/assujettis'),
                axios.get('http://localhost:3001/api/central_recette'),
                axios.get('http://localhost:3001/api/centre_gestionnaire'),
                axios.get('http://localhost:3001/api/centre_fiscal'),
            ]);
            //console.log("teste",assujettisResponse);
            setAssujettis(assujettisResponse.data.rows);
            setCentre_recette(central_recetteResponse.data.rows);
            setCentre_gestionnaire(centre_gestionnaireResponse.data.rows);
            setCentre_fiscal(centre_fiscalResponse.data.rows);

        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <DataContext.Provider value={{ assujettis, central_recette, centre_fiscal, centre_gestionnaire ,loading, error, fetchData }}>
            {children}
        </DataContext.Provider>
    );
};

export { DataProvider, DataContext };
