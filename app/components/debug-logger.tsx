"use client";

import { useEffect, useState } from 'react';

export default function DebugLogger() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const newLogs: string[] = [];
    
    // Log environment variables
    newLogs.push(`NODE_ENV: ${process.env.NODE_ENV}`);
    newLogs.push(`NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL}`);
    
    // Log CSS loading
    const styleSheets = Array.from(document.styleSheets);
    newLogs.push(`Total stylesheets: ${styleSheets.length}`);
    
    styleSheets.forEach((sheet, index) => {
      try {
        const href = sheet.href || 'inline';
        newLogs.push(`Stylesheet ${index}: ${href}`);
      } catch (e) {
        newLogs.push(`Stylesheet ${index}: [CORS blocked]`);
      }
    });
    
    // Check for Tailwind classes
    const testElement = document.createElement('div');
    testElement.className = 'bg-blue-500 text-white p-4';
    document.body.appendChild(testElement);
    
    const computedStyle = window.getComputedStyle(testElement);
    const backgroundColor = computedStyle.backgroundColor;
    const color = computedStyle.color;
    
    newLogs.push(`Test element background: ${backgroundColor}`);
    newLogs.push(`Test element color: ${color}`);
    
    document.body.removeChild(testElement);
    
    // Log window object properties
    newLogs.push(`Window location: ${window.location.href}`);
    newLogs.push(`User agent: ${navigator.userAgent}`);
    
    setLogs(newLogs);
    
    // Console log for debugging
    console.log('=== DEBUG LOGGER ===');
    newLogs.forEach(log => console.log(log));
    console.log('===================');
    
  }, []);

  return (
    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
      <h3 className="text-lg font-bold mb-2">Debug Logs:</h3>
      {logs.map((log, index) => (
        <div key={index} className="mb-1">
          {log}
        </div>
      ))}
    </div>
  );
} 