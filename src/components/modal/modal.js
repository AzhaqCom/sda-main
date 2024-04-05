import React, { useState, useEffect } from 'react';
import regleData from '../../regle.json';
import actionData from '../../actions.json';
import './modal.css'
function Modal({ ruleName }) {
    const [showPopup, setShowPopup] = useState(false);
    const [ruleEffect, setRuleEffect] = useState('');
    const [etat, setEtat]= useState('');
    const [phase, setPhase]= useState('');

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };
    useEffect(() => {
        const lowercaseRuleName = ruleName.toLowerCase().split('(');

        const rule = regleData.find(rule => rule.nom.toLowerCase().includes(lowercaseRuleName[0]));
        const action = actionData.find(action => action.nom.toLowerCase().includes(lowercaseRuleName[0]));

        if (rule) {
            setRuleEffect(rule.effet);
            setEtat(rule.etat)
        } else if (action) {
            setRuleEffect(action.effet);
            setPhase(action.phase)

        } else {
            setRuleEffect("Aucun effet trouvé pour cette règle spéciale.");
        }
    }, [ruleName]);
    return (
        <>
            <div className="rule-name" onClick={togglePopup}>{ruleName}{etat && (<span className={`etat ${etat}`}>{etat}</span>)}{phase &&(<span className={`phase ${phase}`}>{phase}</span>)}</div>
            {showPopup && (
                <div className="popup" onClick={togglePopup}>
                    <div className="popup-content">
                        <h3 className='rule-title'>{ruleName}</h3>
                        <p className='rule-effect'>{ruleEffect}</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default Modal