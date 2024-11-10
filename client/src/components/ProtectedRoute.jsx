import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        // Si le token n'existe pas, redirige vers la page de connexion
        return <Navigate to="/login" replace />;
    }

    // Si le token est présent, affiche le contenu protégé
    return children;
};

export default ProtectedRoute;
