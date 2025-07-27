"use client";

export default function BuildInfo() {
  return (
    <div className="bg-blue-900 text-white p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Build Information:</h3>
      
      <div className="space-y-2">
        <div>
          <strong>Build Time:</strong> {new Date().toISOString()}
        </div>
        
        <div>
          <strong>Environment:</strong> {process.env.NODE_ENV}
        </div>
        
        <div>
          <strong>Next.js Version:</strong> {process.env.NEXT_PUBLIC_APP_VERSION || 'Unknown'}
        </div>
        
        <div>
          <strong>App Name:</strong> {process.env.NEXT_PUBLIC_APP_NAME || 'Unknown'}
        </div>
        
        <div>
          <strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not set'}
        </div>
        
        <div>
          <strong>Window Location:</strong> {typeof window !== 'undefined' ? window.location.href : 'SSR'}
        </div>
        
        <div>
          <strong>User Agent:</strong> {typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'SSR'}
        </div>
      </div>
      
      <div className="mt-4 p-2 bg-blue-800 rounded">
        <strong>CSS Classes Test:</strong>
        <div className="mt-2 space-y-1">
          <div className="bg-red-500 text-white p-2 rounded">Red Box</div>
          <div className="bg-green-500 text-white p-2 rounded">Green Box</div>
          <div className="bg-blue-500 text-white p-2 rounded">Blue Box</div>
        </div>
      </div>
    </div>
  );
} 