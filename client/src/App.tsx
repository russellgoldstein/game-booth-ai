import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ChatInterface from './components/ChatInterface';
import GameContext from './components/GameContext';

const App: React.FC = () => {
  const location = useLocation();
  const [gameContext, setGameContext] = useState<any>(null);

  useEffect(() => {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      htmlElement.style.scrollBehavior = 'auto';
      window.scroll({ top: 0 });
      htmlElement.style.scrollBehavior = '';
    }
  }, [location.pathname]);

  const handleGameContextUpdate = (newContext: any) => {
    setGameContext(newContext);
  };

  return (
    <Box className="App">
      <GameContext
        gameId={gameContext?.gameId}
        onGameSelect={(gameId) => setGameContext({ ...gameContext, gameId })}
        onGameContextUpdate={handleGameContextUpdate}
      />

      {gameContext ? (
        <>
          <ChatInterface gameContext={gameContext} />
        </>
      ) : (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh'
        }}>
          <Typography variant="h6" color="text.secondary">
            Select a game to begin
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default App;
