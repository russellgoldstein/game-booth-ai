import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      htmlElement.style.scrollBehavior = 'auto';
      window.scroll({ top: 0 });
      htmlElement.style.scrollBehavior = '';
    }
  }, [location.pathname]);

  return (
    <Box sx={{ height: '100vh', bgcolor: 'background.default' }}>
      <Routes>
        <Route path='/' element={<ChatInterface />} />
      </Routes>
    </Box>
  );
}

export default App;
