import React from 'react';

function Option({ optionName, optionValue, isChecked, onChange }) {
    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        onChange(optionName, isChecked);
    };

    return (
        <div>
            <label>
                <input type="checkbox" checked={isChecked || false} onChange={handleCheckboxChange} />
                {optionName} : {optionValue}pts
            </label>
        </div>
    );
}

export default Option;
