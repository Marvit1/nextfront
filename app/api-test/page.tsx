"use client";

import { useState, useEffect } from 'react';

export default function ApiTestPage() {
  const [apiStatus, setApiStatus] = useState<string>('Testing...');
  const [articles, setArticles] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://beackkayq.onrender.com';

  useEffect(() => {
    const testApi = async () => {
      try {
        // Test main API endpoint
        const mainRes = await fetch(API_URL);
        if (!mainRes.ok) throw new Error('Main API endpoint failed');
        const mainData = await mainRes.json();
        console.log('Main API response:', mainData);

        // Test articles endpoint
        const articlesRes = await fetch(`${API_URL}/api/articles/`);
        if (!articlesRes.ok) throw new Error('Articles endpoint failed');
        const articlesData = await articlesRes.json();
        setArticles(articlesData.results || []);

        // Test keywords endpoint
        const keywordsRes = await fetch(`${API_URL}/api/keywords/`);
        if (!keywordsRes.ok) throw new Error('Keywords endpoint failed');
        const keywordsData = await keywordsRes.json();
        setKeywords(keywordsData);

        setApiStatus('✅ API is working correctly!');
      } catch (error) {
        console.error('API test failed:', error);
        setApiStatus(`❌ API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    testApi();
  }, [API_URL]);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">API Connection Test</h1>
      
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">API Status</h2>
        <p className="text-lg">{apiStatus}</p>
        <p className="text-sm text-gray-600 mt-2">API URL: {API_URL}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-4 bg-white border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Articles ({articles.length})</h3>
          {articles.length > 0 ? (
            <ul className="space-y-2">
              {articles.slice(0, 5).map((article: any) => (
                <li key={article.id} className="text-sm">
                  {article.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No articles found</p>
          )}
        </div>

        <div className="p-4 bg-white border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Keywords ({keywords.length})</h3>
          {keywords.length > 0 ? (
            <ul className="space-y-2">
              {keywords.map((keyword: any) => (
                <li key={keyword.id} className="text-sm">
                  {keyword.word}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No keywords found</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <a href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </a>
      </div>
    </div>
  );
} 