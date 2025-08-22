import React, { useState, useEffect } from 'react';
import Header from '../AppLayout/Header/Header';
import AppFooter from '../AppLayout/Footer';
import EventsList from '../components/EventList/EventList';
import ScratchCard from '../components/ScratchCard/ScratchCard';
import useDealsStore from '../stores/dealsStore';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

function Events() {
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
  const [showEligibilityReminder, setShowEligibilityReminder] = useState(false);
  const { eligible, welcome_gift_expiry, loading, fetchScratchEligibility } = useDealsStore();

  useEffect(() => {
    const checkEligibility = async () => {
      await fetchScratchEligibility();
    };
    checkEligibility();
  }, [fetchScratchEligibility]);

  useEffect(() => {
    const hasDisplayedScratchCard = localStorage.getItem('scratchCardDisplayed') === 'true';
    const expiryTime = welcome_gift_expiry 
    const currentTime = new Date().toISOString();
    
    const isActuallyEligible = eligible === true && 
                              expiryTime && 
                              currentTime < expiryTime;

    if (isActuallyEligible && !loading) {
      if (!hasDisplayedScratchCard) {
        setShowScratchCard(true);
        setIsBackgroundBlurred(true);
        localStorage.setItem('scratchCardDisplayed', 'true');
      } else {
        setShowEligibilityReminder(true);
      }
    } else {
      setShowEligibilityReminder(false);
    }
  }, [eligible, loading, welcome_gift_expiry]);

  const handleDismiss = () => {
    setShowScratchCard(false);
    setTimeout(() => {
      setIsBackgroundBlurred(false);
    }, 1500);
  };

  const handleScratchComplete = () => {
    setTimeout(() => {
      setIsBackgroundBlurred(false);
    }, 1500);
  };

  const handleCloseReminder = () => {
    setShowEligibilityReminder(false);
  };

  const formatExpiryDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <p>Loading...</p>
        </div>
        <AppFooter />
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      {showEligibilityReminder && (
        <div style={{ 
          padding: '16px 24px', 
          backgroundColor: '#021529', 
          border: '2px solid white',
          borderRadius: '8px',
          margin: '20px 50px',
          position: 'relative'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            color: 'white'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold' 
                }}>
                  🎉
                </span>
                <div>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold',
                    marginBottom: '4px'
                  }}>
                    You're eligible for 20% off your first purchase!
                  </div>
                  <div style={{ 
                    fontSize: '14px',
                    opacity: 0.9
                  }}>
                    Your welcome discount expires on <strong>{formatExpiryDate(welcome_gift_expiry)}</strong>. 
                    The discount will be automatically applied at checkout.
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={handleCloseReminder}
              style={{
                color: 'white',
                border: 'none',
                minWidth: 'auto',
                padding: '4px 8px',
                transition: 'all 0.2s ease',
                borderRadius: '4px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 215, 45, 0.1)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
            />
          </div>
        </div>
      )}

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