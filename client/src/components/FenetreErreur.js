import { Modal, Button } from 'react-bootstrap';
import iconerror from '../images/iconerror.png';

function FenetreErreur({ show, titre , onClose }) {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>
                    <img alt="icon error" src={iconerror} style={{marginRight:'30px'}}/> 
                    {titre} 
                </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button style={{ backgroundColor: "#F2742B", borderColor: "#F2742B" }} onClick={onClose}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FenetreErreur;