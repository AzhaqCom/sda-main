import React, { useState, useEffect } from 'react';
import pouvoirData from '../../pouvoir.json';

function Modalpower({ powerName, powerLancement }) {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedPouvoir, setSelectedPouvoir] = useState(null);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    useEffect(() => {
        const lowercasePouvoirName = powerName.toLowerCase().split('(')[0].trim();
        const pouvoir = pouvoirData.find(pouvoir => pouvoir.nom.toLowerCase() === lowercasePouvoirName);

        if (pouvoir) {
            setSelectedPouvoir(pouvoir);
        } else {
            setSelectedPouvoir(null);
        }
    }, [powerName]);

    return (
        selectedPouvoir && (
            <div className='pouvoir-container'>
                <div className="pouvoir-name" onClick={togglePopup}>{powerName}</div>
                <div className="pouvoir-porte">{selectedPouvoir.portee}</div>
                {powerLancement && (<div className="pouvoir-lancement">{powerLancement}</div>)} 

                {showPopup && (
                    <div className="popup" onClick={togglePopup}>
                        <div className="popup-content">
                            <h3 className='pouvoir-title'>{powerName}</h3>
                            {selectedPouvoir && (
                                <div>
                                    <p className='rule-effect'><b>Effet: </b>{selectedPouvoir.effet}</p>
                                    {selectedPouvoir.effetCanalise && (
                                        <p><b>Effet Canalise</b>: {selectedPouvoir.effetCanalise}</p>

                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    );
}

export default Modalpower;
