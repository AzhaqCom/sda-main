import React from 'react';
import './jeucard.css';
import Modal from '../modal/modal';
import Option from '../option/option';
import Modalpower from '../modalpower/modalpower';
function JeuCard({ selectedCharacter, updateCharacter }) {

    const handleChangeCapacite = (capacite, operation) => {
        const updatedCapacites = { ...selectedCharacter.capacites };

        // Met à jour la valeur de la capacité selon l'opération
        updatedCapacites[capacite] = operation === 'increase' ? selectedCharacter.capacites[capacite] + 1 : selectedCharacter.capacites[capacite] - 1;

        // Crée une nouvelle copie du personnage avec les capacités mises à jour
        const updatedCharacter = {
            ...selectedCharacter,
            capacites: updatedCapacites
        };
        updateCharacter(updatedCharacter);
    };
    const handleChangeCapaciteServant = (servantIndex, capacite, operation) => {
        // Assurez-vous que l'index du servant est valide
        if (servantIndex >= 0 && servantIndex < selectedCharacter.servants.length) {
            // Faites une copie du servant que vous voulez mettre à jour
            const updatedServant = { ...selectedCharacter.servants[servantIndex] };

            // Faites une copie des capacités du servant
            const updatedCapacites = { ...updatedServant.capacites };

            // Met à jour la valeur de la capacité selon l'opération
            updatedCapacites[capacite] = operation === 'increase' ? updatedCapacites[capacite] + 1 : updatedCapacites[capacite] - 1;

            // Met à jour les capacités du servant dans la copie
            updatedServant.capacites = updatedCapacites;

            // Faites une copie du personnage avec le servant mis à jour
            const updatedCharacter = {
                ...selectedCharacter,
                servants: [
                    ...selectedCharacter.servants.slice(0, servantIndex), // Avant le servant mis à jour
                    updatedServant, // Servant mis à jour
                    ...selectedCharacter.servants.slice(servantIndex + 1), // Après le servant mis à jour
                ],
            };

            // Appelez la fonction de mise à jour du personnage fournie par le parent
            updateCharacter(updatedCharacter);
        }
    };

    const handleChangeOption = (optionName, isChecked) => {
        if (isChecked) {
            const option = selectedCharacter.options.find(option => option.nom === optionName);

            if (option) {
                const { action, valeur } = option;
                option.isChecked = true;
                if (action.caracteristique === 'M') {
                    // Logique pour modifier la vitesse de la monture
                    const updatedCaracteristiques = {
                        ...selectedCharacter.caracteristiques,
                        [action.caracteristique]: action.valeur
                    };
                    const updatedPoints = parseInt(selectedCharacter.points) + valeur;
                    const updatedCapacites = {
                        ...selectedCharacter.capacites,
                        PvMonture: 1
                    };

                    // Crée une nouvelle copie du personnage avec les caractéristiques et les points mis à jour
                    const updatedCharacter = {
                        ...selectedCharacter,
                        caracteristiques: updatedCaracteristiques,
                        points: updatedPoints,
                        capacites: updatedCapacites
                    };

                    // Appelle la fonction de mise à jour du personnage fournie par le parent
                    updateCharacter(updatedCharacter);
                } else if (action.caracteristique === 'D') {
                    // Logique pour augmenter ou diminuer la défense
                    let updatedCaracteristiques = {
                        ...selectedCharacter.caracteristiques,
                        [action.caracteristique]: selectedCharacter.caracteristiques[action.caracteristique] + action.valeur
                    };

                    // Vérifie si l'option est Armure Lourde et si le personnage a déjà des équipements
                    if (option.nom === 'Armure Lourde' && selectedCharacter.equipements !== undefined && !selectedCharacter.equipements.length > 0) {
                        updatedCaracteristiques = {
                            ...updatedCaracteristiques,
                            [action.caracteristique]: selectedCharacter.caracteristiques[action.caracteristique] + 2
                        };
                    }

                    const updatedPoints = parseInt(selectedCharacter.points) + valeur;

                    // Crée une nouvelle copie du personnage avec les caractéristiques et les points mis à jour
                    const updatedCharacter = {
                        ...selectedCharacter,
                        caracteristiques: updatedCaracteristiques,
                        points: updatedPoints
                    };

                    // Appelle la fonction de mise à jour du personnage fournie par le parent
                    updateCharacter(updatedCharacter);
                } else if (action.effet === 'regles') {
                    // Logique pour les règles spéciales
                    let updatedRegles = [...selectedCharacter.regles, option.nom];
                    let updatedCaracteristiques = { ...selectedCharacter.caracteristiques };
                    let updatedPoints = parseInt(selectedCharacter.points) + valeur;

                    // Vérifie si l'option est Bannière de Minas Tirith pour mettre à jour la caractéristique C
                    if (option.nom === 'Bannière de Minas Tirith') {
                        const updatedC = selectedCharacter.caracteristiques['C'];
                        const newC = updatedC.split('/')[0];
                        const newCValue = parseInt(newC) + 1;
                        const newCStr = newCValue + '/4+';
                        updatedCaracteristiques = {
                            ...selectedCharacter.caracteristiques,
                            C: newCStr
                        };
                    }

                    // Crée une nouvelle copie du personnage avec les règles spéciales, les caractéristiques et les points mis à jour
                    const updatedCharacter = {
                        ...selectedCharacter,
                        regles: updatedRegles,
                        caracteristiques: updatedCaracteristiques,
                        points: updatedPoints
                    };

                    // Appelle la fonction de mise à jour du personnage fournie par le parent
                    updateCharacter(updatedCharacter);
                } else if (action.effet === 'servant') {
                    // Logique pour les servants
                    let updatedPoints = parseInt(selectedCharacter.points) + valeur;
                    const updatedServants = selectedCharacter.servants.map((servant, index) => {
                        if (index === 0) {
                            // Mettre à jour les caractéristiques du premier servant
                            return {
                                ...servant,
                                caracteristiques: {
                                    ...servant.caracteristiques,
                                    M: 6,
                                    C: "4/4+",
                                    F: 4,
                                    D: 6,
                                    A: 2,
                                    B: 4
                                },
                                capacites: {
                                    ...servant.capacites,
                                    Puissance: 2,
                                    "Points de vie": 2
                                },
                                personnage: 'Capitaine de Minas Tirith'
                            };
                        } else {
                            // Ne rien changer pour les autres servants
                            return servant;
                        }
                    });

                    // Crée une nouvelle copie du personnage avec les servants et les points mis à jour
                    const updatedCharacter = {
                        ...selectedCharacter,
                        servants: updatedServants,
                        points: updatedPoints
                    };

                    // Appelle la fonction de mise à jour du personnage fournie par le parent
                    updateCharacter(updatedCharacter);
                } else if (option.action === 'addmiroir') {
                    // Logique pour ajouter le miroir de Galadriel
                    const updatedRegles = [...selectedCharacter.regles, 'Miroir de Galadriel'];
                    const newServant = {
                        personnage: 'Miroir de Galadriel',
                        caracteristiques: {
                            M: '',
                            C: "",
                            F: '',
                            D: 8,
                            A: '',
                            B: ''
                        },
                        capacites: {
                            "Points de vie": 3
                        }
                    };

                    // Crée une nouvelle copie du personnage avec le nouveau servant et les règles spéciales mises à jour
                    const updatedCharacter = {
                        ...selectedCharacter,
                        servants: [newServant],
                        regles: updatedRegles,
                        points: parseInt(selectedCharacter.points) + valeur
                    };

                    // Appelle la fonction de mise à jour du personnage fournie par le parent
                    updateCharacter(updatedCharacter);
                } else if (option.action === 'addgripoil') {
                    // Logique pour modifier la vitesse de la monture
                    const updatedCaracteristiques = {
                        ...selectedCharacter.caracteristiques,
                        M: 12
                    };
                    const updatedPoints = parseInt(selectedCharacter.points) + valeur;
                    const updatedCapacites = {
                        ...selectedCharacter.capacites,
                        PvMonture: 1
                    };
                    const newServant = {
                        personnage: 'Gripoil',
                        caracteristiques: {
                            M: '12',
                            C: "",
                            F: 4,
                            D: 5,
                            A: '',
                            B: 5
                        },
                        capacites: {
                            "Volonté": 2,
                            "Destin": 1,
                            "Points de vie": 1
                        }
                    };
                    // Crée une nouvelle copie du personnage avec les caractéristiques et les points mis à jour
                    const updatedCharacter = {
                        ...selectedCharacter,
                        servants: [newServant],
                        caracteristiques: updatedCaracteristiques,
                        points: updatedPoints,
                        capacites: updatedCapacites
                    };

                    // Appelle la fonction de mise à jour du personnage fournie par le parent
                    updateCharacter(updatedCharacter);
                }
            }
        } else {
            // Logique pour annuler les effets de l'option décochée
            const option = selectedCharacter.options.find(option => option.nom === optionName);

            if (option) {
                const { action, valeur } = option;
                option.isChecked = false;
                if (action.caracteristique === 'M') {
                    // Logique pour annuler les effets sur la monture
                    const updatedCaracteristiques = {
                        ...selectedCharacter.caracteristiques,
                        [action.caracteristique]: 6
                    };
                    const updatedPoints = parseInt(selectedCharacter.points) - valeur;
                    const { PvMonture, ...updatedCapacites } = selectedCharacter.capacites;
                    // Crée une nouvelle copie du personnage avec les caractéristiques et les points mis à jour
                    const updatedCharacter = {
                        ...selectedCharacter,
                        caracteristiques: updatedCaracteristiques,
                        points: updatedPoints,
                        capacites: updatedCapacites
                    };

                    // Appelle la fonction de mise à jour du personnage fournie par le parent
                    updateCharacter(updatedCharacter);
                } else if (action.caracteristique === 'D') {
                    // Logique pour réduire la défense
                    let updatedCaracteristiques = {
                        ...selectedCharacter.caracteristiques,
                        [action.caracteristique]: selectedCharacter.caracteristiques[action.caracteristique] - action.valeur
                    };

                    // Vérifie si l'option est Armure Lourde et si le personnage a déjà des équipements
                    if (option.nom === 'Armure Lourde' && selectedCharacter.equipements !== undefined && !selectedCharacter.equipements.length > 0) {
                        updatedCaracteristiques = {
                            ...updatedCaracteristiques,
                            [action.caracteristique]: selectedCharacter.caracteristiques[action.caracteristique] - 2
                        };
                    }

                    const updatedPoints = parseInt(selectedCharacter.points) - valeur;

                    // Crée une nouvelle copie du personnage avec les caractéristiques et les points mis à jour
                    const updatedCharacter = {
                        ...selectedCharacter,
                        caracteristiques: updatedCaracteristiques,
                        points: updatedPoints
                    };

                    // Appelle la fonction de mise à jour du personnage fournie par le parent
                    updateCharacter(updatedCharacter);
                } else if (action.effet === 'regles') {
                    // Logique pour annuler les règles spéciales
                    let updatedCaracteristiques = { ...selectedCharacter.caracteristiques };
                    let updatedPoints = parseInt(selectedCharacter.points) - valeur;

                    // Vérifie si l'option est Bannière de Minas Tirith pour mettre à jour la caractéristique C
                    if (option.nom === 'Bannière de Minas Tirith') {
                        const updatedC = selectedCharacter.caracteristiques['C'];
                        const newC = updatedC.split('/')[0];
                        const newCValue = parseInt(newC) - 1;
                        const newCStr = newCValue + '/4+';
                        updatedCaracteristiques = {
                            ...selectedCharacter.caracteristiques,
                            C: newCStr
                        };
                    }

                    // Crée une nouvelle copie du personnage avec les règles spéciales, les caractéristiques et les points mis à jour
                    const updatedCharacter = {
                        ...selectedCharacter,
                        regles: selectedCharacter.regles.filter(rule => rule !== option.nom),
                        caracteristiques: updatedCaracteristiques,
                        points: updatedPoints
                    };

                    // Appelle la fonction de mise à jour du personnage fournie par le parent
                    updateCharacter(updatedCharacter);
                } else if (action.effet === 'servant') {
                    // Logique pour annuler les effets sur le servant
                    let updatedPoints = parseInt(selectedCharacter.points) - valeur;
                    const updatedServants = selectedCharacter.servants.map((servant, index) => {
                        if (index === 0) {
                            // Mettre à jour les caractéristiques du premier servant
                            return {
                                ...servant,
                                caracteristiques: {
                                    ...servant.caracteristiques,
                                    M: 6,
                                    C: "3/4+",
                                    F: 3,
                                    D: 5,
                                    A: 1,
                                    B: 3
                                },
                                capacites: {
                                    ...servant.capacites,
                                    Puissance: 1,
                                    "Points de vie": 1
                                },
                                personnage: 'Vétéran - Guerrier de Minas Tirith'
                            };
                        } else {
                            // Ne rien changer pour les autres servants
                            return servant;
                        }
                    });

                    // Crée une nouvelle copie du personnage avec les servants et les points mis à jour
                    const updatedCharacter = {
                        ...selectedCharacter,
                        servants: updatedServants,
                        points: updatedPoints
                    };

                    // Appelle la fonction de mise à jour du personnage fournie par le parent
                    updateCharacter(updatedCharacter);
                } else if (option.action === 'addmiroir') {
                    // Logique pour retirer le miroir de Galadriel
                    const updatedRegles = selectedCharacter.regles.filter(rule => rule !== 'Miroir de Galadriel');

                    // Crée une nouvelle copie du personnage avec le miroir de Galadriel retiré et les règles spéciales mises à jour
                    const updatedCharacter = {
                        ...selectedCharacter,
                        servants: [],
                        regles: updatedRegles,
                        points: parseInt(selectedCharacter.points) - valeur
                    };

                    // Appelle la fonction de mise à jour du personnage fournie par le parent
                    updateCharacter(updatedCharacter);
                } else if (option.action === 'addgripoil') {
                    // Logique pour modifier la vitesse de la monture
                    const updatedCaracteristiques = {
                        ...selectedCharacter.caracteristiques,
                        M: 6
                    };
                    const updatedPoints = parseInt(selectedCharacter.points) - valeur;
                    const { PvMonture, ...updatedCapacites } = selectedCharacter.capacites;

                    // Crée une nouvelle copie du personnage avec les caractéristiques et les points mis à jour
                    const updatedCharacter = {
                        ...selectedCharacter,
                        servants: [],
                        caracteristiques: updatedCaracteristiques,
                        points: updatedPoints,
                        capacites: updatedCapacites
                    };

                    // Appelle la fonction de mise à jour du personnage fournie par le parent
                    updateCharacter(updatedCharacter);
                }
            }
        }
    };

    return (
        <div className='card-content'>
            <h2 className='name-perso'>{selectedCharacter.personnage} <span className='point-perso'>{selectedCharacter.points}pts</span></h2>
            <table>
                <tbody>
                    <tr>
                        {Object.entries(selectedCharacter.caracteristiques).map(([key, value]) => (
                            <td key={`${key}-${value}`}>{key}</td>
                        ))}
                    </tr>
                    <tr>
                        {Object.entries(selectedCharacter.caracteristiques).map(([key, value]) => (
                            <td key={`${key}-${value}`}>{value}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
            <h3>Capacités</h3>
            <table>
                <tbody>
                    {Object.entries(selectedCharacter.capacites).map(([capacite, value]) => (
                        <tr key={capacite}>
                            <td>{capacite}</td>
                            <td>
                                <button className='btnmod' onClick={() => handleChangeCapacite(capacite, 'decrease')}>-</button>
                                <b>{value}</b>
                                <button className='btnmod' onClick={() => handleChangeCapacite(capacite, 'increase')}>+</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedCharacter.options && selectedCharacter.options.length > 0 && (
                <>
                    <h3>Options</h3>
                    {selectedCharacter.options.map((option, index) => (
                        <Option
                            key={option.nom}
                            optionName={option.nom}
                            optionValue={option.valeur}
                            isChecked={option.isChecked} // Passer isChecked
                            onChange={handleChangeOption}
                        />
                    ))}
                </>
            )}

            {selectedCharacter.servants && selectedCharacter.servants.length > 0 && (
                <>
                    <h3>Servants</h3>
                    <div className='container-servant'>
                        {selectedCharacter.servants.map((servant, index) => (
                            <div key={index} className='servant'>
                                <h5>{servant.personnage}</h5>
                                <table>
                                    <tbody>
                                        <tr>
                                            {Object.entries(servant.caracteristiques).map(([key, value]) => (
                                                <td key={`${key}-${value}`}>{key}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            {Object.entries(servant.caracteristiques).map(([key, value]) => (
                                                <td key={`${key}-${value}`}>{value}</td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                                <table>
                                    <tbody>
                                        {Object.entries(servant.capacites).map(([capacite, value]) => (
                                            <tr key={capacite}>
                                                <td>{capacite}</td>
                                                <td>
                                                    <button onClick={() => handleChangeCapaciteServant(index, capacite, 'decrease')}>-</button>
                                                    {value}
                                                    <button onClick={() => handleChangeCapaciteServant(index, capacite, 'increase')}>+</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <div className='grid2'>

                {selectedCharacter.regles && selectedCharacter.regles.length > 0 && (
                    <div className='regle-spe-perso'>
                        <h3>Règles spéciales</h3>
                        <div className='regle-perso'>
                            {selectedCharacter.regles.map((rule, index) => (<Modal key={rule} ruleName={rule} />))}
                        </div>
                    </div>
                )}

                {selectedCharacter.actions && selectedCharacter.actions.length > 0 && (
                    <div className='action-hero-perso'>
                        <h3>Actions Héroïques</h3>
                        <div className='action-perso'>
                            {selectedCharacter.actions.map((action, index) => (<Modal key={action} ruleName={action} />))}
                        </div>
                    </div>
                )}
            </div>

            {selectedCharacter.pouvoirsMagiques && selectedCharacter.pouvoirsMagiques.length > 0 && (
                <div className='pouvoir-hero-perso'>
                    <h3>Pouvoirs Magiques</h3>

                    <div className='action-perso'>
                        {selectedCharacter.pouvoirsMagiques.map((pouvoir, index) => (<Modalpower key={pouvoir.nom} powerName={pouvoir.nom} powerLancement={pouvoir.valeur} />))}

                    </div>

                </div>
            )}

        </div>
    );
}

export default JeuCard;