import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const ApiConfigContext = createContext();

// Provider component
export const ApiConfigProvider = ({ children }) => {
  const [apiUrl, setApiUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/config.json')
      .then((res) => res.json())
      .then((config) => {
        setApiUrl(config.API_URL);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load config.json', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading configuration...</div>;
  }

  return (
    <ApiConfigContext.Provider value={{ apiUrl }}>
      {children}
    </ApiConfigContext.Provider>
  );
};

// Custom hook for using API URL
export const useApiConfig = () => useContext(ApiConfigContext);
