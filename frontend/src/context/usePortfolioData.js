import { useContext } from 'react';
import { PortfolioContext } from './PortfolioContext';

export const usePortfolioData = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolioData must be used within PortfolioProvider');
  return context;
};
