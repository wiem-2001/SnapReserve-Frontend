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
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import useEventStore from '../../stores/eventStore';
import useAuthStore from '../../stores/authStore';
import useTicketStore from '../../stores/ticketStore';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import './EventDetails.css';
import FraudAlertModal from '../../components/FraudAlertModal/FraudAlertModal';

const { Title, Text } = Typography;

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 
  const { event, fetchEvent, loading: eventLoading, error: eventError, deleteEvent, toggleFavorite, favoriteEvents } = useEventStore();
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
  const [calendarValue, setCalendarValue] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [userLoading, setUserLoading] = useState(false);
  const [isFraudModalVisible, setIsFraudModalVisible] = useState(false);

  const availableDates = useMemo(() => 
    event?.dates?.map(d => ({
      dayjsDate: dayjs(d.date).startOf('day'),
      time: dayjs(d.date).format('HH:mm'),
      full: d.date,
      location: d.location,
    })) || [],
    [event?.dates]
  );

  const findClosestUpcomingDate = useCallback(() => {
    const today = dayjs().startOf('day');
    const futureDates = availableDates.filter(d => 
      d.dayjsDate.isSame(today) || d.dayjsDate.isAfter(today)
    );
    if (futureDates.length === 0) return availableDates[0] || null;
    return futureDates.sort((a, b) => a.dayjsDate.diff(b.dayjsDate))[0];
  }, [availableDates]);

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
    
    const fetchUserAndFavorites = async () => {
      try {
        setUserLoading(true);
        if (!authUser && isMounted) {
          await getMe();
        }
        if (authUser?.user?.role === "attendee" && isMounted) {
          await useEventStore.getState().fetchFavorites();
        }
      } catch (err) {
        if (isMounted) {
          message.error(err.response?.data?.message || 'Failed to load user data or favorites');
        }
      } finally {
        if (isMounted) {
          setUserLoading(false);
        }
      }
    };

    fetchUserAndFavorites();

    return () => {
      isMounted = false;
    };
  }, [authUser, getMe]);

  useEffect(() => {
    if (favoriteEvents && id) {
      const isEventFavorited = favoriteEvents.some(fav => fav.eventId === id);
      setIsFavorited(isEventFavorited);
    }
  }, [favoriteEvents, id]);

  useEffect(() => {
    if (availableDates.length === 0) {
      setSelectedDate(null);
      setCalendarValue(null);
      return;
    }
    const closestDate = findClosestUpcomingDate();
    setSelectedDate(closestDate);
    setCalendarValue(closestDate ? closestDate.dayjsDate : dayjs());
  }, [availableDates, findClosestUpcomingDate]);

  // Calendar-related functions
  const disabledDate = useCallback(
    (current) => {
      if (!current) return true;
      return !availableDates.some((d) => d.dayjsDate.isSame(current.startOf('day')));
    },
    [availableDates]
  );

  const dateCellRender = useCallback(
    (value) => {
      const dateInfo = availableDates.find((d) => d.dayjsDate.isSame(value.startOf('day')));
      if (!dateInfo) return null;
      const isSelected = selectedDate && selectedDate.dayjsDate.isSame(value.startOf('day'));
      return (
        <div
          style={{
            background: isSelected ? '#d1ac09ff' : 'transparent',
            color: isSelected ? '#fff' : 'black',
            borderRadius: 4,
            padding: 4,
            cursor: 'pointer',
          }}
        >
          <Text
            strong={isSelected}
            style={{
              fontSize: 15,
              color: isSelected ? '#fff' : 'black',
            }}
          >
            <div>{dateInfo.time}</div>
            <div>{dateInfo.location}</div>
          </Text>
        </div>
      );
    },
    [availableDates, selectedDate]
  );

  const onSelectDate = useCallback(
    (value) => {
      const dateInfo = availableDates.find((d) => d.dayjsDate.isSame(value.startOf('day')));
      if (dateInfo) {
        setSelectedDate(dateInfo);
        setCalendarValue(value);
      }
    },
    [availableDates]
  );

  const onPanelChange = useCallback((value) => {
    setCalendarValue(value);
  }, []);

  const handleToggleFavorite = useCallback(async () => {
    if (!authUser?.user) {
      message.info('Please log in to favorite events');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    try {
      const response = await toggleFavorite(id);
      console.log('Toggle favorite response:', response);
      setIsFavorited(response.isFavorited);
      message.success(response.isFavorited ? 'Event added to favorites' : 'Event removed from favorites');
      await useEventStore.getState().fetchFavorites();
    } catch (error) {
      message.error(error || 'Failed to toggle favorite');
    }
  }, [authUser, id, toggleFavorite, navigate, location]);

  const handleDeleteClick = useCallback((e) => {
    e.stopPropagation();
    console.log("triggered")
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

  const handleCheckout = useCallback(async () => {
    if (!authUser?.user) {
      message.info('Please log in to buy tickets');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
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
      if (error.response?.status === 403) {
        setIsFraudModalVisible(true);
      } else {
        message.error(error.message || 'Failed to initiate checkout');
      }
    }
  }, [authUser, navigate, location, selectedDate, selectedTierIds, totalPrice, quantities, createCheckoutSession, event?.id]);

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
              onClick={handleToggleFavorite}
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

      {authUser?.user?.role !== "organizer" && (
        <div>
          {selectedDate && (
            <div style={{ marginTop: 12 }}>
              <Text strong>
                {selectedDate.dayjsDate.format('YYYY-MM-DD')} at {selectedDate.time} — {selectedDate.location}
              </Text>
            </div>
          )}

          <div style={{ marginBottom: 24, textAlign: 'left' }}>
            <Title level={2}>Select Ticket Types & Quantities</Title>

            <Checkbox.Group
              value={selectedTierIds}
              onChange={handleTierChange}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {event.pricingTiers.map(tier => (
                <Checkbox
                  key={tier.id}
                  value={tier.id}
                  disabled={tier.capacity === 0}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {tier.name}
                    <Tooltip title={`Max seats available: ${tier.capacity}`}>
                      <InfoCircleOutlined style={{ color: '#888' }} />
                    </Tooltip>
                    {tier.capacity === 0 && (
                      <Text type="danger" style={{ marginLeft: 8 }}>
                        Sold out
                      </Text>
                    )}
                  </span>
                </Checkbox>
              ))}
            </Checkbox.Group>

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
            <div>
              {selectedTierIds.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                    Total:{' '}
                    <Text style={{ color: '#d1ac09ff' }}>${totalPrice.toFixed(2)}</Text>
                  </div>
                </div>
              )}
            </div>
            <Button
              type="primary"
              size="large"
              disabled={
                !selectedDate || 
                selectedTierIds.length === 0 || 
                totalPrice === 0 ||
                selectedTierIds.every(tierId => {
                  const tier = event.pricingTiers.find(t => t.id === tierId);
                  return !tier || tier.capacity === 0;
                })
              }
              onClick={handleCheckout}
              loading={checkoutLoading}
              className='buy-ticket-btn'
            >
              {checkoutLoading ? 'Processing...' : 'Buy Ticket'}
            </Button>
            <FraudAlertModal
              visible={isFraudModalVisible}
              onClose={() => setIsFraudModalVisible(false)}
            />
          </div>

          
        </div>
      )}
          <ConfirmModal
            visible={showConfirm}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setShowConfirm(false)}
            title="Are you sure you want to delete this event?"
          />
      {authUser?.user?.role === "organizer" && (
        <div>
          <Title level={2}>Ticket Pricing Overview</Title>
          {availableDates?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Text strong>Available Dates:</Text>
              <ul>
                {availableDates.map((date, idx) => (
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
                <div>
                  {tier.capacity === 0 ? (
                    <Text type="danger">Sold out</Text>
                  ) : (
                    <Text type="secondary">{tier.capacity} seats available</Text>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;