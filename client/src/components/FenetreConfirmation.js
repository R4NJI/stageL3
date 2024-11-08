import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function FenetreConfirmation({show,titre,message,onClose,onConfirm,danger}) {

    return (
    <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
            <Modal.Title>{titre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {message}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
                Annuler
            </Button>
            <Button style={{ backgroundColor: danger ? "#F2742B" : "hsl(197, 88%, 48%)", borderColor: danger ? "#F2742B" : "hsl(197, 88%, 48%)" }} onClick={onConfirm}>
                Confirmer
            </Button>
        </Modal.Footer>
    </Modal>
    );
}

export default FenetreConfirmation;