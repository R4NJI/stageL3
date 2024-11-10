import { Modal, Button } from 'react-bootstrap';
import iconsuccess from '../images/iconsuccess.png';

function FenetreReussite({ show, titre , onClose }) {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>
                    <img alt="icon success" src={iconsuccess} style={{ marginRight: '30px' }} />
                    {titre}
                </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button style={{ backgroundColor: "hsl(197, 88%, 48%)", borderColor: "hsl(197, 88%, 48%)" }} onClick={onClose}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FenetreReussite;