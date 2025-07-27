"use client";

import { useState, useEffect } from 'react';
import TailwindTest from '../components/tailwind-test';
import DebugLogger from '../components/debug-logger';
import CSSInspector from '../components/css-inspector';
import BuildInfo from '../components/build-info';

export default function TestPage() {
  const [apiStatus, setApiStatus] = useState<string>('Testing...');
  const [apiUrl, setApiUrl] = useState<string>('');

  useEffect(() => {
    // Show the API URL being used
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || 'Not set');
    
            // Test API connection
        const testApi = async () => {
          try {
            // Test direct API first
            const directUrl = process.env.NEXT_PUBLIC_API_URL || 'https://beackkayq.onrender.com';
            const directResponse = await fetch(`${directUrl}/api/articles/`);
            
            if (directResponse.ok) {
              setApiStatus('✅ Direct API is working!');
            } else {
              // Test proxy API
              const proxyResponse = await fetch('/api/proxy');
              if (proxyResponse.ok) {
                setApiStatus('✅ Proxy API is working!');
              } else {
                setApiStatus(`❌ Both APIs failed: Direct(${directResponse.status}), Proxy(${proxyResponse.status})`);
              }
            }
          } catch (error) {
            setApiStatus(`❌ API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        };

    testApi();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Test Page
        </h1>
        
        {/* Debug Logger */}
        <div className="mb-8">
          <DebugLogger />
        </div>
        
        {/* CSS Inspector */}
        <div className="mb-8">
          <CSSInspector />
        </div>
        
        {/* Build Info */}
        <div className="mb-8">
          <BuildInfo />
        </div>
        
        {/* Tailwind CSS Test Component */}
        <div className="mb-8">
          <TailwindTest />
        </div>

        {/* API Test */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            API Connection Test
          </h2>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400">
              <strong>API URL:</strong> {apiUrl}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Status:</strong> {apiStatus}
            </p>
          </div>
        </div>

        {/* Environment Variables Test */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Environment Variables
          </h2>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400">
              <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not set'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 