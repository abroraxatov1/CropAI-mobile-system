import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadModelData } from '../ml/modelData';

const ModelContext = createContext(null);

export function ModelProvider({ children }) {
  const [modelData, setModelData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    loadModelData()
      .then((data) => {
        if (mounted) setModelData(data);
      })
      .catch((e) => {
        if (mounted) setError(e);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const value = {
    modelData,
    isLoading: !modelData && !error,
    error,
  };

  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
}

export function useModel() {
  const ctx = useContext(ModelContext);
  if (!ctx) throw new Error('useModel must be used within a ModelProvider');
  return ctx;
}
