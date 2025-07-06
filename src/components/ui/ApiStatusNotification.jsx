"use client";

import { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";

export default function ApiStatusNotification() {
  const [showNotification, setShowNotification] = useState(false);
  const [isApiKeyValid, setIsApiKeyValid] = useState(true);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    const isValid =
      apiKey && apiKey !== "YOUR_API_KEY_HERE" && apiKey.length > 10;

    setIsApiKeyValid(isValid);
    if (!isValid) {
      setShowNotification(true);
    }
  }, []);

  if (!showNotification || isApiKeyValid) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-yellow-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-md">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-sm">Demo Mode Active</h4>
          <p className="text-xs mt-1 opacity-90">
            YouTube API key not configured. Using mock data for demonstration.
            Add your API key to .env file for full functionality.
          </p>
        </div>
        <button
          onClick={() => setShowNotification(false)}
          className="text-white hover:text-gray-200 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
