import React, { useState, useEffect } from 'react';
import { Calendar, Button, Tooltip, InputNumber, Checkbox } from 'antd';
import { EnvironmentOutlined, CalendarOutlined, TagOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import './EventDetails.css';
import { useParams } from 'react-router-dom';
import useEventStore from '../../stores/eventStore';
import dayjs from 'dayjs';

const EventDetails = () => {
  const { id } = useParams();
  const { event, fetchEvent, loading, error } = useEventStore();

  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTierIds, setSelectedTierIds] = useState([]);
  const [calendarValue, setCalendarValue] = useState(dayjs()); // Controls calendar's visible month/year
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (id) fetchEvent(id);
  }, [id, fetchEvent]);

  // Process event data when loaded: set pricing tiers & quantities
  useEffect(() => {
    if (event?.pricingTiers?.length) {
      const allIds = event.pricingTiers.map(t => t.id);
      setSelectedTierIds(allIds);

      const initialQuantities = {};
      allIds.forEach(id => {
        initialQuantities[id] = 1;
      });
      setQuantities(initialQuantities);
    }
  }, [event]);

  // Available dates formatted with dayjs
  const availableDates = event?.dates?.map(d => ({
    dayjsDate: dayjs(d.date).startOf('day'),
    location: d.location,
  })) || [];

  // Find closest upcoming date (today or later)
  const findClosestUpcomingDate = () => {
    const today = dayjs().startOf('day');
    const futureDates = availableDates.filter(d => d.dayjsDate.isSame(today) || d.dayjsDate.isAfter(today));
    if (futureDates.length === 0) return null;
    futureDates.sort((a, b) => a.dayjsDate.diff(b.dayjsDate));
    return futureDates[0];
  };

  // When availableDates changes (i.e., event loaded), set default selectedDate and calendarValue
  useEffect(() => {
    if (availableDates.length === 0) {
      setSelectedDate(null);
      setCalendarValue(dayjs());
      return;
    }

    const closestDate = findClosestUpcomingDate() || availableDates[0];
    setSelectedDate(closestDate);
    setCalendarValue(closestDate.dayjsDate);
  }, [event]); // run when event changes (and availableDates too)

  const disabledDate = current => {
    if (!current) return true;
    return !availableDates.some(d => d.dayjsDate.isSame(current.startOf('day')));
  };

  const dateCellRender = value => {
    const dateInfo = availableDates.find(d => d.dayjsDate.isSame(value.startOf('day')));
    return dateInfo ? (
      <div style={{ fontSize: 10, color: '#555' }}>{dateInfo.location}</div>
    ) : null;
  };

  const onSelectDate = value => {
    const dateInfo = availableDates.find(d => d.dayjsDate.isSame(value.startOf('day')));
    if (dateInfo) setSelectedDate(dateInfo);
    else setSelectedDate(null);
  };

  // Keep calendar view month/year in sync if user navigates months
  const onPanelChange = (value) => {
    setCalendarValue(value);
  };

  const toggleFavorite = () => setIsFavorited(!isFavorited);

  const handleTierChange = checkedIds => {
    setSelectedTierIds(checkedIds);

    const newQuantities = { ...quantities };
    checkedIds.forEach(id => {
      if (!newQuantities[id]) newQuantities[id] = 1;
    });

    Object.keys(newQuantities).forEach(id => {
      if (!checkedIds.includes(id)) newQuantities[id] = 0;
    });
    setQuantities(newQuantities);
  };

  const handleQuantityChange = (tierId, value) => {
    if (value < 0) return;
    setQuantities(prev => ({
      ...prev,
      [tierId]: value,
    }));
  };

  const totalPrice = selectedTierIds.reduce((sum, tierId) => {
    const tier = event.pricingTiers.find(t => t.id === tierId);
    const qty = quantities[tierId] || 0;
    return sum + (tier ? tier.price * qty : 0);
  }, 0);

  if (loading) return <div>Loading event...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!event) return <div>No event found</div>;

  return (
    <div className="event-details" style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <div
        className="event-header"
        style={{
          backgroundImage: `url(${event.image})`,
          position: 'relative',
          borderRadius: 8,
          overflow: 'hidden',
          height: 250,
          marginBottom: 24,
        }}
      >
        <div
          className="event-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, rgba(2, 21, 41, 0.85) 30%, rgba(2, 21, 41, 0.5) 100%)',
            color: '#ffd72d',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <h1 className="event-title" style={{ margin: 0, fontSize: 32 }}>
            {event.title}
          </h1>
          <div className="event-meta" style={{ marginTop: 8, fontSize: 16, display: 'flex', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CalendarOutlined />
              <span>Multiple Dates</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <EnvironmentOutlined />
              <span>Various Locations</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <TagOutlined />
              <span>{event.category}</span>
            </div>
          </div>
        </div>
        <Tooltip title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}>
          <Button
            type="text"
            icon={isFavorited ? <HeartFilled style={{ color: '#ff4d4f', fontSize: 24 }} /> : <HeartOutlined style={{ fontSize: 24 }} />}
            onClick={toggleFavorite}
            style={{ position: 'absolute', top: 16, right: 16 }}
          />
        </Tooltip>
      </div>

      <div className="event-description-block" style={{ marginBottom: 24, textAlign: 'left' }}>
        <h2>Description</h2>
        <p style={{ fontSize: 16, lineHeight: 1.5, color: '#021529' }}>{event.description}</p>
      </div>

      <div className="event-calendar" style={{ marginBottom: 24, textAlign: 'left' }}>
        <h2>Available Dates & Locations</h2>
        <Calendar
          fullscreen={false}
          disabledDate={disabledDate}
          dateCellRender={dateCellRender}
          onSelect={onSelectDate}
          value={calendarValue}
          onPanelChange={onPanelChange}
          style={{ border: '1px solid #ddd', borderRadius: 8 }}
        />
        {selectedDate && (
          <div style={{ marginTop: 12, fontWeight: 'bold', color: '#021529' }}>
            Selected Date: {selectedDate.dayjsDate.format('YYYY-MM-DD')} <br />
            Location: {selectedDate.location}
          </div>
        )}
      </div>

      <div className="event-pricing" style={{ marginBottom: 24, textAlign: 'left' }}>
        <h2>Select Ticket Types & Quantities</h2>
        <Checkbox.Group
          options={event.pricingTiers.map(tier => ({
            label: tier.name,
            value: tier.id,
          }))}
          value={selectedTierIds}
          onChange={handleTierChange}
          style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 16 }}
        />

        {selectedTierIds.map(tierId => {
          const tier = event.pricingTiers.find(t => t.id === tierId);
          return (
            <div key={tierId} style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ minWidth: 150 }}>{tier.name} — ${tier.price.toFixed(2)}</span>
              <InputNumber
                min={0}
                max={10}
                value={quantities[tierId] || 1}
                onChange={value => handleQuantityChange(tierId, value)}
                disabled={!selectedTierIds.includes(tierId)}
                style={{ width: 80 }}
              />
            </div>
          );
        })}
      </div>

      <div className="event-purchase" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="event-price" style={{ fontSize: 24, fontWeight: 'bold', color: '#021529' }}>
          Total: ${totalPrice.toFixed(2)}
        </div>
        <Button
          type="primary"
          size="large"
          style={{ backgroundColor: '#021529', borderColor: '#021529', color: '#ffd72d' }}
          disabled={!selectedDate || selectedTierIds.length === 0 || totalPrice === 0}
        >
          Buy Ticket
        </Button>
      </div>
    </div>
  );
};

export default EventDetails;
