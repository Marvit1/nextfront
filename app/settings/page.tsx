"use client";

import { useState, useEffect, FormEvent } from 'react';

interface Keyword {
    id: number;
    word: string;
}

const SettingsPage = () => {
    const [keywords, setKeywords] = useState<Keyword[]>([]);
    const [newKeyword, setNewKeyword] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://beackkayq.onrender.com';
  const API_ENDPOINT = '/api/proxy'; // Use local proxy

    useEffect(() => {
        const fetchKeywords = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_ENDPOINT}/keywords`);
                if (!response.ok) {
                    throw new Error('Failed to fetch keywords');
                }
                const data: Keyword[] = await response.json();
                setKeywords(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };
        fetchKeywords();
    }, [API_BASE_URL]);

    const handleAddKeyword = async (e: FormEvent) => {
        e.preventDefault();
        if (!newKeyword.trim()) return;

        try {
            const response = await fetch(`${API_ENDPOINT}/keywords`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ word: newKeyword }),
            });
            if (!response.ok) {
                throw new Error('Failed to add keyword');
            }
            const addedKeyword: Keyword = await response.json();
            setKeywords([...keywords, addedKeyword]);
            setNewKeyword('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    const handleDeleteKeyword = async (id: number) => {
        try {
            const response = await fetch(`${API_ENDPOINT}/keywords/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete keyword');
            }
            setKeywords(keywords.filter(k => k.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    if (isLoading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

    return (
        <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 tracking-tight">Manage Keywords</h1>
            
            <form onSubmit={handleAddKeyword} className="mb-8 flex items-center gap-2">
                <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add a new keyword..."
                    className="flex-grow p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                />
                <button 
                    type="submit" 
                    className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors dark:focus:ring-offset-gray-900"
                >
                    Add
                </button>
            </form>

            <div className="space-y-3">
                {keywords.length > 0 ? (
                    keywords.map(keyword => (
                        <div key={keyword.id} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800/50 dark:border-gray-700">
                            <span className="font-medium text-gray-800 dark:text-gray-200">{keyword.word}</span>
                            <button
                                onClick={() => handleDeleteKeyword(keyword.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors dark:focus:ring-offset-gray-900"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 bg-white p-8 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                        <h2 className="text-xl font-semibold">No Keywords</h2>
                        <p className="mt-2 text-sm">Add a keyword above to start monitoring news.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsPage; 