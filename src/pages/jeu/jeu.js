import React, { useState, useEffect } from 'react';
import JeuCard from '../../components/jeucard/jeucard';
import PersoData from '../../perso.json';

function Jeu() {
    const [selectedCharacters, setSelectedCharacters] = useState(() => {
        const storedCharacters = localStorage.getItem('selectedCharacters');
        return storedCharacters ? JSON.parse(storedCharacters) : [];
    });
    const [selectedCharacter, setSelectedCharacter] = useState('');

    useEffect(() => {
        localStorage.setItem('selectedCharacters', JSON.stringify(selectedCharacters));
    }, [selectedCharacters]);

    const handleSelectChange = (event) => {
        setSelectedCharacter(event.target.value);
    };

    const handleAddCharacter = () => {
        if (selectedCharacter) {
            const selectedCharacterObj = PersoData.find(character => character.personnage === selectedCharacter);
            if (selectedCharacterObj) {
                setSelectedCharacters(prevSelectedCharacters => {
                    return [...prevSelectedCharacters, selectedCharacterObj];
                });
                setSelectedCharacter('');
            }
        }
    };

    const handleRemoveCharacter = (characterName) => {
        setSelectedCharacters(prevSelectedCharacters => {
            return prevSelectedCharacters.filter(character => character.personnage !== characterName);
        });
    };

    const updateCharacter = (updatedCharacter) => {
        setSelectedCharacters(prevSelectedCharacters => {
            return prevSelectedCharacters.map(character => {
                if (character.personnage === updatedCharacter.personnage) {
                    return updatedCharacter;
                }
                return character;
            });
        });
    };

    // Regrouper les personnages par faction
    const groupedCharacters = PersoData.reduce((acc, character) => {
        acc[character.faction] = acc[character.faction] || [];
        acc[character.faction].push(character);
        return acc;
    }, {});

    return (
        <div className='container'>
            <select value={selectedCharacter} onChange={handleSelectChange}>
                <option value="">Sélectionner un personnage</option>
                {Object.keys(groupedCharacters).map((faction, index) => (
                    <optgroup key={index} label={faction}>
                        {groupedCharacters[faction].map((character, characterIndex) => (
                            <option key={characterIndex} value={character.personnage}>{character.personnage} ({character.points}pts)</option>
                        ))}
                    </optgroup>
                ))}
            </select>
            <button className='btn-add' onClick={handleAddCharacter}>Ajouter</button>
            {selectedCharacters.map((character, index) => (
                <div key={index} className='card'>
                    
                    <JeuCard selectedCharacter={character} updateCharacter={updateCharacter}/>
                    <button className='btnsuppr' onClick={() => handleRemoveCharacter(character.personnage)}>Supprimer</button>
                </div>
            ))}
        </div>
    );
}

export default Jeu;
