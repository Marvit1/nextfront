"use client";

import { useEffect, useState } from 'react';

export default function CSSInspector() {
  const [cssInfo, setCssInfo] = useState<any>({});

  useEffect(() => {
    const inspectCSS = () => {
      const info: any = {};
      
      // Check if Tailwind CSS is loaded
      const tailwindClasses = [
        'bg-blue-500',
        'text-white',
        'p-4',
        'rounded',
        'hover:bg-blue-600'
      ];
      
      const testElement = document.createElement('div');
      testElement.style.position = 'absolute';
      testElement.style.left = '-9999px';
      testElement.style.top = '-9999px';
      testElement.className = tailwindClasses.join(' ');
      document.body.appendChild(testElement);
      
      const computedStyle = window.getComputedStyle(testElement);
      
      info.tailwindClasses = {};
      tailwindClasses.forEach(className => {
        const element = document.createElement('div');
        element.className = className;
        document.body.appendChild(element);
        const style = window.getComputedStyle(element);
        info.tailwindClasses[className] = {
          applied: style.cssText !== '',
          backgroundColor: style.backgroundColor,
          color: style.color,
          padding: style.padding
        };
        document.body.removeChild(element);
      });
      
      document.body.removeChild(testElement);
      
      // Check CSS files
      const styleSheets = Array.from(document.styleSheets);
      info.stylesheets = styleSheets.map((sheet, index) => {
        try {
          return {
            index,
            href: sheet.href || 'inline',
            disabled: sheet.disabled,
            media: sheet.media.mediaText || 'all'
          };
        } catch (e) {
          return {
            index,
            href: '[CORS blocked]',
            disabled: sheet.disabled,
            media: 'unknown'
          };
        }
      });
      
      // Check for Tailwind CSS in stylesheets
      info.tailwindFound = false;
      styleSheets.forEach(sheet => {
        try {
          const rules = Array.from(sheet.cssRules || sheet.rules || []);
          rules.forEach(rule => {
            if (rule.cssText && rule.cssText.includes('tailwind')) {
              info.tailwindFound = true;
            }
          });
        } catch (e) {
          // CORS blocked
        }
      });
      
      setCssInfo(info);
      
      // Console log
      console.log('=== CSS INSPECTOR ===');
      console.log('CSS Info:', info);
      console.log('=====================');
    };
    
    // Wait a bit for CSS to load
    setTimeout(inspectCSS, 1000);
  }, []);

  return (
    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
      <h3 className="text-lg font-bold mb-4">CSS Inspector:</h3>
      
      <div className="mb-4">
        <h4 className="font-bold mb-2">Tailwind Classes Test:</h4>
        {cssInfo.tailwindClasses && Object.entries(cssInfo.tailwindClasses).map(([className, data]: [string, any]) => (
          <div key={className} className="mb-2 ml-4">
            <div className="font-bold">{className}:</div>
            <div className="ml-4">
              <div>Applied: {data.applied ? '✅' : '❌'}</div>
              <div>Background: {data.backgroundColor}</div>
              <div>Color: {data.color}</div>
              <div>Padding: {data.padding}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mb-4">
        <h4 className="font-bold mb-2">Stylesheets ({cssInfo.stylesheets?.length || 0}):</h4>
        {cssInfo.stylesheets?.map((sheet: any) => (
          <div key={sheet.index} className="mb-1 ml-4">
            {sheet.index}: {sheet.href} {sheet.disabled ? '(disabled)' : ''}
          </div>
        ))}
      </div>
      
      <div>
        <h4 className="font-bold mb-2">Tailwind CSS Found:</h4>
        <div className="ml-4">
          {cssInfo.tailwindFound ? '✅ Yes' : '❌ No'}
        </div>
      </div>
    </div>
  );
} 