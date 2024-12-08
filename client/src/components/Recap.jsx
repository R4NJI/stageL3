import { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { DataContext } from '../DataProvider';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Recap({ show, onClose, critere , mois0, recette,prevision,recettecumulee,previsioncumulee, recetteParMois,previsionParMois}) {
    const { centre_gestionnaire, assujettis } = useContext(DataContext);
     console.log('cg:',centre_gestionnaire)

    // Soumission du formulaire
    const handleOnSubmit = (e) => {
        e.preventDefault();
        // alert("Génération du rapport en cours...")
            // Création du document PDF
        const pdf = new jsPDF('p', 'mm', 'a4'); // Orientation Portrait, Unité millimètre, Taille A4
        const margin = 20;
        let y = margin;

        // Ajouter un titre
        pdf.setFontSize(16);
        pdf.text('Rapport détaillé', pdf.internal.pageSize.getWidth() / 2, y, { align: 'center' });
        y += 20;

        // Ajouter les informations générales
        pdf.setFontSize(12);
        pdf.text(`Année : ${critere.annee}`, margin, y);
        pdf.text(`Bureau : ${critere.centre === 'Tous' ? 'Tous' : centre_gestionnaire.find(cg => cg.code_bureau === critere.centre)?.cg_abbrev}`, margin + 100, y);
        y += 10;

        pdf.text(`Période du : ${mois0[parseInt(critere.moisDebut, 10) - 1]}`, margin, y);
        pdf.text(`Jusqu'à : ${mois0[parseInt(critere.moisFin, 10) - 1]}`, margin + 100, y);
        y += 10;

        pdf.text(`Impôt : ${critere.nature=='Tous' ? 'Tous' : assujettis?.find(as=>(as.num_imp==critere.nature)).abrev}`, margin, y);
        pdf.text(`Excédent : ${recette - prevision}`, margin + 100, y);
        y += 10;

        // Ajouter les données financières
        pdf.text(`Recette : ${recette}`, margin, y);
        pdf.text(`Prévision : ${prevision}`, margin + 100, y);
        y += 10;

        pdf.text(`Recette cumulée : ${recettecumulee}`, margin, y);
        pdf.text(`Prévision cumulée : ${previsioncumulee}`, margin + 100, y);
        y += 10;

        
        pdf.text(`Taux de réalisation : ${Math.round((recette / prevision) * 100)} %`, margin, y);
        pdf.text(`Taux de réalisation cumulé : ${Math.round((recettecumulee / previsioncumulee) * 100)} %`, margin + 100, y);
        y += 10;

        // Ajouter la table
        y += 10; // Ajouter un espace avant la table


        //logique pour récupérer la période et les recettes et prévisions de cett période en tableau
        // Convertir moisDebut et moisFin en nombres
        const debut = parseInt(critere.moisDebut, 10); 
        const fin = parseInt(critere.moisFin, 10);
        let mois1=[]

        for (let index = debut - 1; index < fin; index++) {
            mois1.push(mois0[index]); // Ajouter les mois dans le tableau
        }
        
        // Initialiser un tableau de recettes et previsions avec 0 pour chaque mois
        let recettes = Array(fin - debut + 1).fill(0);
        let previsions = Array(fin - debut + 1).fill(0);

        // Mettre à jour les recettes par mois si les données sont reçues
        recetteParMois.forEach(item => {
            const moisIndex = item.mois - debut; // Trouver l'index correspondant au mois dans l'intervalle
            if (moisIndex >= 0 && moisIndex < recettes.length) {
            recettes[moisIndex] = item.somme_recettes; // Mettre à jour la recette pour le mois correspondant
            }
        });

        // Mettre à jour les previsions par mois si les données sont reçues
        previsionParMois.forEach(item => {
            const moisIndex = item.mois_prev - debut; // Trouver l'index correspondant au mois dans l'intervalle
            if (moisIndex >= 0 && moisIndex < previsions.length) {
            previsions[moisIndex] = item.somme_prevision; // Mettre à jour la recette pour le mois correspondant
            }
        });
   

        // Générer les données pour chaque mois
        const tableRows = mois1.map((mois, index) => ({
            mois,
            recette: recettes[index], // Exemple de données, à remplacer par vos valeurs
            prevision: previsions[index], // Exemple de données, à remplacer par vos valeurs
        }));

        // Colonnes du tableau
        const tableColumns = [
            { header: 'Mois', dataKey: 'mois' },
            { header: 'Recette', dataKey: 'recette' },
            { header: 'Prévision', dataKey: 'prevision' },
        ];

        // Ajouter le tableau avec bordures visibles
        pdf.autoTable({
            head: [tableColumns.map(col => col.header)],  // Titres des colonnes
            body: tableRows.map(row => tableColumns.map(col => row[col.dataKey])),  // Données du tableau
            startY: y,  // Positionner le tableau sous le texte
            theme: 'striped',  // Utiliser le thème 'striped' pour des lignes alternées (mais aussi avec des bordures)
            styles: {
                fontSize: 10,
                cellPadding: 3,  // Padding des cellules
                lineWidth: 0.2,  // Épaisseur des lignes de la table
                lineColor: [0, 0, 0],  // Couleur des lignes (noir)
            },
            headStyles: {
                fillColor: [255, 255, 255],  // Couleur de fond des en-têtes (blanc)
                textColor: [0, 0, 0],  // Couleur du texte des en-têtes (noir)
            },
            bodyStyles: {
                fillColor: [255, 255, 255],  // Fond des cellules (blanc)
                textColor: [0, 0, 0],  // Couleur du texte des cellules (noir)
            },
            margin: { top: 20, bottom: 20, left: 20, right: 20 },
        });
                

            // Sauvegarder le fichier PDF
            pdf.save(`Rapport_${critere.annee}.pdf`);

            onClose()
        
    }



    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Récapitulatif</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className='d-flex flex-column' encType="multipart/form-data" onSubmit={handleOnSubmit} style={{fontSize:'17px',fontFamily:'Roboto',color:'rgb(120,137,145)'}}>
                    <div className='d-flex justify-content-between mb-3' style={{width:'100%'}}>
                        <div className='d-flex flex-column'>
                            <div>Année : <span style={{color:'black'}}>{critere.annee}</span></div>
                            <div>Bureau : <span style={{color:'black'}}>{critere.centre==='Tous' ? 'Tous' : centre_gestionnaire?.find(cg=>(cg.code_bureau==critere.centre))?.cg_abbrev}</span></div>
                            <div>Recette : <span style={{color:'black'}}>{recette}</span></div>
                            <div>Recette cumulée : <span style={{color:'black'}}>{recettecumulee}</span></div>
                            
                            
                        </div>
                        <div className='d-flex flex-column'>
                            <div>Période du : <span style={{color:'black'}}>{mois0[parseInt(critere.moisDebut,10)-1]}</span></div>
                            <div>Impôt : <span style={{color:'black'}}>{critere.nature=='Tous' ? 'Tous' : assujettis?.find(as=>(as.num_imp==critere.nature)).abrev}</span></div>
                            <div>Prévision : <span style={{color:'black'}}>{prevision}</span></div>
                            <div>Prévision cumulée : <span style={{color:'black'}}>{previsioncumulee}</span></div>
                        </div>
                        <div className='d-flex flex-column'>
                            <div>Jusqu'à : <span style={{color:'black'}}>{mois0[parseInt(critere.moisFin,10)-1]}</span></div>
                            <div>Excédent : <span style={{color:'black'}}>{recette-prevision}</span></div>
                            <div>Taux de réalisation : <span style={{color:'black'}}>{Math.round((recette / prevision) * 100)} %</span></div>
                            <div>Taux de réalisation cumulé: <span style={{color:'black'}}>{Math.round((recettecumulee / previsioncumulee) * 100)} %</span></div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type='button' className='btn btn-secondary me-3' onClick={onClose}>Annuler</button>
                        <button type='submit' className='btn btn-info'>Générer rapport</button>
                    </div>
                  
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default Recap;
                            {/* <div>Impôt :</div>
                            <div>Recette : </div>
                            <div>Recette cumulée :</div>
                            <div>Excédent :</div>
                            <div>Taux de réalisation :</div>
                            <div>Taux de réalisation cumulé :</div> */}
                        {/* <div className='d-flex flex-column'>
                            <div>{critere.annee}</div>
                            <div>{mois0[parseInt(critere.moisDebut,10)-1]}</div>
                            <div>{mois0[parseInt(critere.moisFin,10)-1]}</div>
                            <div>{critere.centre}</div>
                            <div>{critere.nature}</div>
                          
                        </div>
                        */}