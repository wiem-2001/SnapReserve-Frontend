import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Calendar, 
  Button, 
  Tooltip, 
  InputNumber, 
  Checkbox, 
  message, 
  Spin,
  Typography 
} from 'antd';
import { 
  EnvironmentOutlined, 
  CalendarOutlined, 
  TagOutlined, 
  HeartOutlined, 
  HeartFilled, 
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined 
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import useEventStore from '../../stores/eventStore';
import useAuthStore from '../../stores/authStore';
import useTicketStore from '../../stores/ticketStore';
import ConfirmModal from '../../components/ConfirmModal';
import './EventDetails.css';

const { Title, Text } = Typography;

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { event, fetchEvent, loading: eventLoading, error: eventError, deleteEvent } = useEventStore();
  const { user: authUser, getMe } = useAuthStore();
  const { 
    createCheckoutSession, 
    loading: checkoutLoading, 
    error: checkoutError 
  } = useTicketStore();
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTierIds, setSelectedTierIds] = useState([]);
  const [calendarValue, setCalendarValue] = useState(dayjs());
  const [quantities, setQuantities] = useState({});
  const [userLoading, setUserLoading] = useState(false);

  const availableDates = useMemo(() => 
    event?.dates?.map(d => ({
      dayjsDate: dayjs(d.date).startOf('day'),
      location: d.location,
    })) || [],
    [event?.dates]
  );

  const findClosestUpcomingDate = useCallback(() => {
    const today = dayjs().startOf('day');
    const futureDates = availableDates.filter(d => 
      d.dayjsDate.isSame(today) || d.dayjsDate.isAfter(today)
    );
    if (futureDates.length === 0) return null;
    return futureDates.sort((a, b) => a.dayjsDate.diff(b.dayjsDate))[0];
  }, [availableDates]);

  // Fetch event and user data
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        if (id && isMounted) {
          await fetchEvent(id);
        }
      } catch (err) {
        if (isMounted) {
          message.error(err.response?.data?.message || 'Failed to load event');
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id, fetchEvent]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchUser = async () => {
      try {
        setUserLoading(true);
        if (!authUser && isMounted) {
          await getMe();
        }
      } catch (err) {
        if (isMounted) {
          message.error(err.response?.data?.message || 'Failed to load user data');
        }
      } finally {
        if (isMounted) {
          setUserLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [authUser, getMe]);

  // Initialize date selection
  useEffect(() => {
    if (availableDates.length === 0) {
      setSelectedDate(null);
      setCalendarValue(dayjs());
      return;
    }

    const closestDate = findClosestUpcomingDate() || availableDates[0];
    
    if (
      !selectedDate || 
      !closestDate.dayjsDate.isSame(selectedDate.dayjsDate) ||
      closestDate.location !== selectedDate.location
    ) {
      setSelectedDate(closestDate);
      setCalendarValue(closestDate.dayjsDate);
    }
  }, [availableDates, findClosestUpcomingDate, selectedDate]);

  // Initialize ticket selections
  useEffect(() => {
    if (event?.pricingTiers?.length) {
      const initialQuantities = {};
      const allTierIds = [];
      
      event.pricingTiers.forEach(tier => {
        initialQuantities[tier.id] = quantities[tier.id] || 1;
        allTierIds.push(tier.id);
      });

      if (JSON.stringify(allTierIds) !== JSON.stringify(selectedTierIds)) {
        setSelectedTierIds(allTierIds);
      }
      
      setQuantities(prev => ({ ...prev, ...initialQuantities }));
    }
  }, [event?.pricingTiers]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calendar helpers
  const disabledDate = useCallback((current) => {
    if (!current) return true;
    return !availableDates.some(d => d.dayjsDate.isSame(current.startOf('day')));
  }, [availableDates]);

  const dateCellRender = useCallback((value) => {
    const dateInfo = availableDates.find(d => d.dayjsDate.isSame(value.startOf('day')));
    return dateInfo ? (
      <Text type="secondary" style={{ fontSize: 10 }}>{dateInfo.location}</Text>
    ) : null;
  }, [availableDates]);

  const onSelectDate = useCallback((value) => {
    const dateInfo = availableDates.find(d => d.dayjsDate.isSame(value.startOf('day')));
    setSelectedDate(dateInfo || null);
  }, [availableDates]);

  const onPanelChange = useCallback((value) => {
    setCalendarValue(value);
  }, []);

  // Event handlers
  const toggleFavorite = useCallback(() => setIsFavorited(prev => !prev), []);
  const handleDeleteClick = useCallback((e) => {
    e.stopPropagation();
    setShowConfirm(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await deleteEvent(id);
      message.success('Event deleted successfully');
      navigate('/manage-events');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete event');
    } finally {
      setShowConfirm(false);
    }
  }, [deleteEvent, id, navigate]);

  const handleTierChange = useCallback((checkedIds) => {
    setSelectedTierIds(checkedIds);
    setQuantities(prev => {
      const newQuantities = { ...prev };
      checkedIds.forEach(id => newQuantities[id] = newQuantities[id] || 1);
      return newQuantities;
    });
  }, []);

  const handleQuantityChange = useCallback((tierId, value) => {
    if (value < 0) return;
    setQuantities(prev => ({
      ...prev,
      [tierId]: value,
    }));
  }, []);

    const totalPrice = useMemo(() => 
    selectedTierIds.reduce((sum, tierId) => {
      const tier = event?.pricingTiers?.find(t => t.id === tierId);
      const qty = quantities[tierId] || 0;
      return sum + (tier ? tier.price * qty : 0);
    }, 0),
    [selectedTierIds, quantities, event?.pricingTiers]
  );

  // Checkout handler
  const handleCheckout = useCallback(async () => {
    if (!selectedDate || selectedTierIds.length === 0 || totalPrice === 0) return;

    try {
      const tierQuantities = selectedTierIds
        .filter(tierId => quantities[tierId] > 0)
        .map(tierId => ({
          tierId,
          quantity: quantities[tierId]
        }));

      const { url } = await createCheckoutSession({
        eventId: event.id,
        date: selectedDate.dayjsDate.toISOString(),
        tierQuantities
      });

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      message.error(error.message || 'Failed to initiate checkout');
    }
  }, [selectedDate, selectedTierIds, totalPrice, quantities, createCheckoutSession, event?.id]);

  // Calculate total price


  // Loading states
  if (eventLoading || userLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (eventError) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <Text type="danger">{eventError}</Text>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <Text>No event found</Text>
      </div>
    );
  }

  return (
    <div className="event-details" style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', height: 250, marginBottom: 24 }}>
        <img
          src={`${import.meta.env.VITE_API_URL}${event.image}`}
          alt="Event"
          crossOrigin="anonymous"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(2, 21, 41, 0.85) 30%, rgba(2, 21, 41, 0.5) 100%)',
          color: '#ffd72d',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <Title level={1} style={{ margin: 0, color: '#ffd72d' }}>{event.title}</Title>
          
          <div style={{ marginTop: 8, fontSize: 16, display: 'flex', gap: 24 }}>
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

        {authUser?.user?.role === "attendee" ? (
          <Tooltip title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}>
            <Button
              type="text"
              icon={isFavorited ? 
                <HeartFilled style={{ color: '#ff4d4f', fontSize: 24 }} /> : 
                <HeartOutlined style={{ fontSize: 24 }} />
              }
              onClick={toggleFavorite}
              style={{ position: 'absolute', top: 16, right: 16 }}
            />
          </Tooltip>
        ) : (
          <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 2, display: 'flex', gap: 8 }}>
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#ffd72d' }} />}
              onClick={() => navigate(`/edit-event/${id}`)}
              style={{ fontSize: 20, backgroundColor: '#021529' }}
            />
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: '#ffd72d' }} />}
              onClick={handleDeleteClick}
              style={{ fontSize: 20, backgroundColor: '#021529' }}
            />
          </div>
        )}
      </div>

      
      <div style={{ marginBottom: 24, textAlign: 'left' }}>
        <Title level={2}>Description</Title>
        <Text style={{ fontSize: 16, lineHeight: 1.5 }}>{event.description}</Text>
      </div>

      
      <div style={{ marginBottom: 24, textAlign: 'left' }}>
        <Title level={2}>Available Dates & Locations</Title>
        <Calendar
          fullscreen={false}
          disabledDate={disabledDate}
          dateCellRender={dateCellRender}
          onSelect={onSelectDate}
          value={calendarValue}
          onPanelChange={onPanelChange}
          style={{ border: '1px solid #ddd', borderRadius: 8 }}
        />
       
      </div>
{authUser?.user?.role === "attendee" && (
  <div>
    {selectedDate && (
      <div style={{ marginTop: 12 }}>
        <Text strong>Selected Date: {selectedDate.dayjsDate.format('YYYY-MM-DD')}</Text>
        <br />
        <Text strong>Location: {selectedDate.location}</Text>
      </div>
    )}

    <div style={{ marginBottom: 24, textAlign: 'left' }}>
      <Title level={2}>Select Ticket Types & Quantities</Title>

      <Checkbox.Group
        options={event.pricingTiers.map(tier => ({
          label: (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {tier.name}
              <Tooltip title={`Max seats available: ${tier.capacity}`}>
                <InfoCircleOutlined style={{ color: '#888' }} />
              </Tooltip>
            </span>
          ),
          value: tier.id,
        }))}
        value={selectedTierIds}
        onChange={handleTierChange}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      />

      {selectedTierIds.map(tierId => {
        const tier = event.pricingTiers.find(t => t.id === tierId);
        const currentQty = quantities[tierId] || 0;

        return (
          <div
            key={tierId}
            style={{
              marginTop: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: 6,
              backgroundColor: '#f9f9f9',
            }}
          >
            <div style={{ flex: 1, fontWeight: 600 }}>
              {tier.name} — <Text style={{ color: '#d1ac09ff' }}>${tier.price.toFixed(2)}</Text>
            </div>
            <div style={{ minWidth: 180, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text>Quantity:</Text>
              <InputNumber
                min={0}
                max={tier.capacity}
                value={currentQty}
                onChange={value => {
                  if (value > tier.capacity) {
                    message.warning(`Max seats for ${tier.name} is ${tier.capacity}`);
                    return;
                  }
                  handleQuantityChange(tierId, value);
                }}
                disabled={!selectedTierIds.includes(tierId)}
                style={{ width: 90 }}
              />
              <Tooltip title={`Max seats available: ${tier.capacity}`}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  / {tier.capacity} available
                </Text>
              </Tooltip>
            </div>
          </div>
        );
      })}
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: 24, fontWeight: 'bold' }}>
        Total: <Text style={{ color: '#d1ac09ff' }}>${totalPrice.toFixed(2)}</Text>
      </div>
      <Button
        type="primary"
        size="large"
        style={{ backgroundColor: '#021529', borderColor: '#021529', color: '#ffd72d' }}
        disabled={!selectedDate || selectedTierIds.length === 0 || totalPrice === 0}
        onClick={handleCheckout}
        loading={checkoutLoading}
      >
        {checkoutLoading ? 'Processing...' : 'Buy Ticket'}
      </Button>
    </div>

    <ConfirmModal
      visible={showConfirm}
      onConfirm={handleDeleteConfirm}
      onCancel={() => setShowConfirm(false)}
      title="Are you sure you want to delete this event?"
    />
  </div>
)}
  {authUser?.user?.role ==="organizer" &&(
    <div>
   <Title level={2}>Ticket Pricing Overview</Title>
    {event.availableDates?.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Text strong>Available Dates:</Text>
            <ul>
              {event.availableDates.map((date, idx) => (
                <li key={idx}>
                  {date.dayjsDate.format('YYYY-MM-DD')} — {date.location}
                </li>
              ))}
            </ul>
          </div>
        )}
     <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {event.pricingTiers.map(tier => (
        <div
          key={tier.id}
          style={{
            padding: '12px 16px',
            border: '1px solid #ddd',
            borderRadius: 6,
            backgroundColor: '#fafafa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <strong>{tier.name}</strong>
            <br />
            <Text style={{ color: '#766209ff' }}>${tier.price.toFixed(2)}</Text>
          </div>
          <Text type="secondary">{tier.capacity} seats available</Text>
          </div>
           ))}
        </div>
    </div>
  )}
    </div>
  );
};

export default EventDetails;