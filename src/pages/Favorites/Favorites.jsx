import React, { useState, useEffect} from 'react';
import {
  Button,
  Typography,
  Divider,
  message,
  Empty,
  Pagination,
  Spin
} from 'antd';
import { HeartFilled } from '@ant-design/icons';
import EventCard from '../../components/EventCard/EventCard';
import './Favorites.css';
import useEventStore from '../../stores/eventStore';
import useAuthStore from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';


const { Title } = Typography;

const Favorites = () => {

  const { 
    favoriteEvents, 
    fetchFavorites,
    error: error 
  } = useEventStore();
  const navigate = useNavigate();
  useEffect(() => {
      fetchFavorites();
  }, [fetchFavorites]);

  const handleRemoveFavorite = (eventId) => {
    message.success('Removed from favorites');
  };

  return (
    
    <div className="favorites-container">
      <div className="favorites-header">
        <Title level={2} className="favorites-title">
          
          My Favorites
        </Title>
        <Divider />
      </div>
      {
        favoriteEvents.length !== 0 ?(
        <div className="favorites-grid">
            {favoriteEvents.map(fav => (
              <div key={fav.id} className="favorite-card-wrapper">
                <EventCard 
                  event={fav.event} 
                  saved={true} 
                  onSaveToggle={() => handleRemoveFavorite(fav.event.id)}
                />
              </div>
            ))}
          </div>)
          :(
        <div className="empty-favorites">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span style={{ color: '#666' }}>
                You haven't saved any events to favorites yet
              </span>
            }
          >
             <Button className='explore-event-btn' onClick={() => navigate('/')}>
              Explore Events
              </Button>
          </Empty>
        </div>
      ) 
      }
    </div>
  );
};

export default Favorites;