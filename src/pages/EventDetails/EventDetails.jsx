import React, { useState } from 'react';
import { Calendar, Button, Tooltip, InputNumber } from 'antd';
import { EnvironmentOutlined, CalendarOutlined, TagOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import './EventDetails.css';

const EventDetails = ({ event }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const toggleFavorite = () => setIsFavorited(!isFavorited);
  const handleQuantityChange = (value) => setQuantity(value);

  const unitPrice = event.priceRange[0];
  const totalPrice = unitPrice * quantity;

  return (
    <div className="event-details">
      <div className="event-header" style={{ backgroundImage: `url(${event.image})` }}>
        <div className="event-overlay">
          <div className="event-info">
            <h1 className="event-title">{event.title}</h1>
            <div className="event-meta">
              <div><CalendarOutlined /> {event.date}</div>
              <div><EnvironmentOutlined /> {event.location}</div>
              <div><TagOutlined /> {event.category}</div>
            </div>
          </div>
        </div>
        <Tooltip title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}>
          <Button 
            type="text" 
            icon={isFavorited ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />} 
            onClick={toggleFavorite} 
            className="favorite-btn"
          />
        </Tooltip>
      </div>

      <div className="event-description-block">
        <p>{event.description}</p>
      </div>

      <div className="event-calendar">
        <h2>Available Dates</h2>
        <Calendar fullscreen={false} />
      </div>

      <div className="event-quantity">
        <label htmlFor="ticket-qty">Quantity:</label>
        <InputNumber
          id="ticket-qty"
          min={1}
          max={10}
          value={quantity}
          onChange={handleQuantityChange}
        />
      </div>

      <div className="event-purchase">
        <div className="event-price">${totalPrice.toFixed(2)}</div>
        <Button 
          type="primary" 
          size="large"
          style={{ backgroundColor: '#021529', borderColor: '#021529', color: '#ffd72d' }}
        >
          Buy Ticket
        </Button>
      </div>
    </div>
  );
};

export default EventDetails;
