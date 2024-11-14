import { useState } from 'react';
import iconsend from '../images/iconsend.png';
import './Chat.css';
import photo from '../images/gpt.png';
import axios from 'axios';

function Chat() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const handleInputChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleSendMessage = async () => {
        if (question.trim() === "") return;

        try {
            // Envoie la question à l'API et récupère la réponse
            const response = await axios.post("http://localhost:3001/api/chat", { question });
            setAnswer(response.data.answer); // Met à jour l'état avec la réponse de l'IA
        } catch (error) {
            console.error("Erreur lors de la récupération de la réponse de l'IA :", error);
            setAnswer("Une erreur est survenue. Veuillez réessayer.");
        }

        // Réinitialise le champ de question
        setQuestion("");
    };

    return (
        <div className='m-4'>
            {/* Champ pour la question */}
            <div className='d-flex justify-content-center mt-3' style={{ borderRadius: '26px', backgroundColor: 'rgb(225,225,225)' }}>
                <div style={{ flex: 1, height: '43px' }} className='ps-4'>
                    <textarea
                        style={{ resize: 'none' }}
                        placeholder="Posez votre question ici"
                        value={question}
                        onChange={handleInputChange}
                    />
                </div>
                <button id='button-send' onClick={handleSendMessage}>
                    <img alt="icon d'envoi" src={iconsend} />
                </button>
            </div>

            {/* Affichage de la réponse */}
            {answer && (
                <div className='answer-container mt-3 d-flex'>
                    <div className='me-3'>
                        <img alt="photo de profil" src={photo} style={{ width: '60px', height: '60px', borderRadius: '100%' }} />
                    </div>
                    <div style={{ backgroundColor: 'rgb(105,113,108)', color: 'white', padding: '10px', borderRadius: '10px' }}>
                        {answer}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chat;
