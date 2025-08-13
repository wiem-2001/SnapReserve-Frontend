import React, { useState, useEffect } from 'react';
import Header from '../AppLayout/Header/Header';
import AppFooter from '../AppLayout/Footer';
import EventsList from '../components/EventList/EventList';
import ScratchCard from '../components/ScratchCard/ScratchCard';


function Events() {
  const [showScratchCard, setShowScratchCard] = useState(true);
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(true);


  useEffect(() => {
    const hasSeenScratchCard = localStorage.getItem('hasSeenScratchCard');
    if (hasSeenScratchCard) {
      setShowScratchCard(false);
      setIsBackgroundBlurred(false);
    }
  }, []);

  const handleDismiss = () => {
    setShowScratchCard(false);
    setIsBackgroundBlurred(false);
    localStorage.setItem('hasSeenScratchCard', 'true');
  };

  const handleScratchComplete = () => {
    setIsBackgroundBlurred(false);
  };

  return (
    <div>
      <Header />
      <div style={{ 
        position: 'relative',
        marginLeft: '50px',
        filter: isBackgroundBlurred ? 'blur(5px)' : 'none',
        transition: 'filter 0.3s ease',
        pointerEvents: isBackgroundBlurred ? 'none' : 'auto'
      }}>
        <EventsList />
      </div>
      <AppFooter />

  
      {isBackgroundBlurred && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          backdropFilter: 'blur(2px)'
        }} />
      )}

    
      {showScratchCard && (
        <ScratchCard 
          onDismiss={handleDismiss}
          onScratchComplete={handleScratchComplete}
        />
      )}
    </div>
  );
}

export default Events;