import React, { useState } from 'react';

interface InputFormProps {
    onSubmit: (input: string) => void;
}

export const InputForm = ({ onSubmit }: InputFormProps) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(input);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter gene name or PDB ID"
            />
            <button type="submit">Submit</button>
        </form>
    );
};