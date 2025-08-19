import React, { useState } from 'react';
import { HeartOutlined, HeartFilled, ClockCircleOutlined, EnvironmentOutlined, FireOutlined, TagOutlined, StarFilled, ThunderboltOutlined, GiftOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Tag, Progress, Badge, Carousel, Divider, Modal } from 'antd';

const Deals = () => {
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Summer Music Festival 2023',
      category: 'Music',
      description: 'The biggest music festival of the year featuring top artists from around the world.',
      image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      dates: [
        { id: '1', date: '2023-08-15T18:00:00', location: 'Central Park, New York' }
      ],
      pricingTiers: [
        { id: '1', name: 'General Admission', originalPrice: 129.99, dealPrice: 99.99, discount: '23% OFF', capacity: 1000, sold: 850 },
      ],
      isFavorite: false,
      dealEnds: '2023-08-10T23:59:59',
      isHotDeal: true,
      dealType: 'flash-sale',
      rating: 4.8,
      reviewCount: 124
    },
    {
      id: '2',
      title: 'Tech Innovators Conference',
      category: 'Technology',
      description: 'Join industry leaders as they discuss the future of technology, AI, and digital transformation.',
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
      dates: [
        { id: '4', date: '2023-09-10T09:00:00', location: 'Convention Center, San Francisco' }
      ],
      pricingTiers: [
        { id: '5', name: 'Standard', originalPrice: 349.99, dealPrice: 299.99, discount: '14% OFF', capacity: 500, sold: 420 },
      ],
      isFavorite: true,
      dealEnds: '2023-08-31T23:59:59',
      isHotDeal: false,
      dealType: 'early-bird',
      rating: 4.6,
      reviewCount: 89,
      groupDeal: {
        minPeople: 3,
        discount: '15%',
        pricePerPerson: 254.99
      }
    },
    {
      id: '3',
      title: 'Food & Wine Experience',
      category: 'Food',
      description: 'A culinary journey featuring Michelin-star chefs and world-class sommeliers.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      dates: [
        { id: '5', date: '2023-10-05T19:00:00', location: 'Grand Ballroom, Chicago' }
      ],
      pricingTiers: [
        { id: '7', name: 'Tasting Pass', originalPrice: 179.99, dealPrice: 149.99, discount: '17% OFF', capacity: 400, sold: 320 },
      ],
      isFavorite: false,
      dealEnds: '2023-09-20T23:59:59',
      isHotDeal: true,
      dealType: 'bundle',
      rating: 4.9,
      reviewCount: 215,
      bundleDeal: {
        includes: ['VIP seating', 'Meet & greet with chefs', 'Exclusive wine tasting']
      }
    },
    {
      id: '4',
      title: 'Comedy Night Special',
      category: 'Comedy',
      description: 'An evening of laughter with top stand-up comedians from Netflix specials and late-night TV.',
      image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80',
      dates: [
        { id: '7', date: '2023-08-25T20:00:00', location: 'Laugh Factory, Los Angeles' }
      ],
      pricingTiers: [
        { id: '9', name: 'General Admission', originalPrice: 59.99, dealPrice: 39.99, discount: '33% OFF', capacity: 300, sold: 210 },
      ],
      isFavorite: false,
      dealEnds: '2023-08-20T23:59:59',
      isHotDeal: true,
      dealType: 'last-minute',
      rating: 4.7,
      reviewCount: 76
    },
    {
      id: '5',
      title: 'Broadway Show Package',
      category: 'Theater',
      description: 'Experience the magic of Broadway with our exclusive show package deal.',
      image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      dates: [
        { id: '8', date: '2023-09-15T19:30:00', location: 'Majestic Theatre, New York' }
      ],
      pricingTiers: [
        { id: '10', name: 'Premium Seating', originalPrice: 199.99, dealPrice: 149.99, discount: '25% OFF', capacity: 150, sold: 120 },
      ],
      isFavorite: false,
      dealEnds: '2023-09-01T23:59:59',
      isHotDeal: false,
      dealType: 'package',
      rating: 4.9,
      reviewCount: 342,
      packageDeal: {
        includes: ['Best available seats', 'Program booklet', 'Post-show cocktail']
      }
    },
    {
      id: '6',
      title: 'VIP Sports Lounge Access',
      category: 'Sports',
      description: 'Watch the big game in style with all-inclusive food and drinks.',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2005&q=80',
      dates: [
        { id: '9', date: '2023-10-01T16:00:00', location: 'Stadium Club, Boston' }
      ],
      pricingTiers: [
        { id: '11', name: 'VIP Lounge', originalPrice: 249.99, dealPrice: 199.99, discount: '20% OFF', capacity: 80, sold: 65 },
      ],
      isFavorite: true,
      dealEnds: '2023-09-15T23:59:59',
      isHotDeal: true,
      dealType: 'exclusive',
      rating: 4.8,
      reviewCount: 112,
      exclusiveDeal: {
        perks: ['All-you-can-eat buffet', 'Premium open bar', 'Meet former players']
      }
    }
  ]);

  const [visible, setVisible] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  const toggleFavorite = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, isFavorite: !event.isFavorite } : event
    ));
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const showDealDetails = (event) => {
    setSelectedDeal(event);
    setVisible(true);
  };

  const getDealBadge = (dealType) => {
    switch(dealType) {
      case 'flash-sale':
        return { text: 'FLASH SALE', color: '#ff4d4f', icon: <ThunderboltOutlined /> };
      case 'early-bird':
        return { text: 'EARLY BIRD', color: '#13c2c2', icon: <ClockCircleOutlined /> };
      case 'bundle':
        return { text: 'BUNDLE DEAL', color: '#722ed1', icon: <GiftOutlined /> };
      case 'last-minute':
        return { text: 'LAST CHANCE', color: '#fa8c16', icon: <FireOutlined /> };
      case 'package':
        return { text: 'VIP PACKAGE', color: '#eb2f96', icon: <StarFilled /> };
      case 'exclusive':
        return { text: 'EXCLUSIVE', color: '#52c41a', icon: <TeamOutlined /> };
      default:
        return { text: 'DEAL', color: '#1890ff', icon: <TagOutlined /> };
    }
  };

  return (
    <div className="event-deals-page" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Featured Deals Carousel */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#021529', marginBottom: '16px', fontSize: '24px', fontWeight: 'bold' }}>
          <FireOutlined style={{ color: '#ffd72d', marginRight: '8px' }} />
          Today's Featured Deals
        </h2>
        <Carousel autoplay dots={{ className: 'custom-dots' }} effect="fade">
          {events.filter(e => e.isHotDeal).map(event => (
            <div key={event.id} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{
                background: `linear-gradient(rgba(2, 21, 41, 0.7), rgba(2, 21, 41, 0.7)), url(${event.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 60px'
              }}>
                <div style={{ maxWidth: '600px', color: '#fff' }}>
                  <Tag color={getDealBadge(event.dealType).color} style={{ 
                    color: '#fff', 
                    fontWeight: 'bold',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    {getDealBadge(event.dealType).icon}
                    {getDealBadge(event.dealType).text}
                  </Tag>
                  <h3 style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    color: '#ffd72d'
                  }}>
                    {event.title}
                  </h3>
                  <p style={{ fontSize: '16px', marginBottom: '20px' }}>{event.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ 
                      backgroundColor: 'rgba(255, 215, 45, 0.2)',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: '1px solid #ffd72d'
                    }}>
                      <span style={{ 
                        fontSize: '20px', 
                        fontWeight: 'bold',
                        color: '#ffd72d'
                      }}>
                        {formatPrice(event.pricingTiers[0].dealPrice)}
                      </span>
                      <span style={{ 
                        fontSize: '14px', 
                        textDecoration: 'line-through',
                        color: '#ccc',
                        marginLeft: '8px'
                      }}>
                        {formatPrice(event.pricingTiers[0].originalPrice)}
                      </span>
                    </div>
                    <Button 
                      type="primary" 
                      style={{
                        backgroundColor: '#ffd72d',
                        borderColor: '#ffd72d',
                        color: '#021529',
                        fontWeight: 'bold',
                        height: '40px'
                      }}
                      onClick={() => showDealDetails(event)}
                    >
                      View Deal
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Deal Categories */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ color: '#021529', marginBottom: '16px', fontSize: '24px', fontWeight: 'bold' }}>
          <TagOutlined style={{ color: '#ffd72d', marginRight: '8px' }} />
          Deal Types
        </h2>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
          {['All Deals', 'Flash Sales', 'Early Birds', 'Bundle Deals', 'Last Minute', 'VIP Packages', 'Group Discounts'].map((type, index) => (
            <Button 
              key={index}
              type={index === 0 ? 'primary' : 'default'}
              style={{
                backgroundColor: index === 0 ? '#021529' : '#fff',
                borderColor: index === 0 ? '#021529' : '#d9d9d9',
                color: index === 0 ? '#ffd72d' : '#021529',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                borderRadius: '20px'
              }}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Deals Grid */}
      <Divider orientation="left" style={{ color: '#021529', fontSize: '20px', fontWeight: 'bold' }}>
        All Current Deals
      </Divider>
      
      <div className="event-deals-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '24px'
      }}>
        {events.map((event) => {
          const dealBadge = getDealBadge(event.dealType);

          return (
            <div 
              key={event.id} 
              className="event-deal-card" 
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #e1c71a',
                background: '#fff',
                position: 'relative',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                zIndex: 2
              }}>
                <Tag 
                  color={dealBadge.color} 
                  style={{ 
                    color: '#fff',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {dealBadge.icon}
                  {dealBadge.text}
                </Tag>
              </div>
              
              {event.isHotDeal && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  zIndex: 2
                }}>
                  <Badge.Ribbon 
                    text="HOT DEAL" 
                    color="#ff4d4f"
                    style={{ 
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  />
                </div>
              )}
              
              <div 
                className="event-image-container" 
                style={{
                  height: '180px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => showDealDetails(event)}
              >
                <img 
                  src={event.image} 
                  alt={event.title} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer'
                  }}
                  className="event-image"
                />
                
                <div 
                  className="event-favorite-btn" 
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    zIndex: '2',
                    cursor: 'pointer',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => toggleFavorite(event.id)}
                >
                  {event.isFavorite ? (
                    <HeartFilled style={{ color: '#ff4d4f', fontSize: '16px' }} />
                  ) : (
                    <HeartOutlined style={{ color: '#021529', fontSize: '16px' }} />
                  )}
                </div>

                {/* Rating Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(2, 21, 41, 0.8)',
                  color: '#ffd72d',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  <StarFilled style={{ marginRight: '4px' }} />
                  {event.rating} ({event.reviewCount})
                </div>
              </div>
              
              <div className="event-deal-content" style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '12px' }}>
                  <Tag color="#021529" style={{ fontWeight: 'bold', color: '#ffd72d' }}>
                    {event.category}
                  </Tag>
                </div>
                
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '18px', 
                  fontWeight: 'bold',
                  color: '#021529',
                  cursor: 'pointer'
                }} onClick={() => showDealDetails(event)}>
                  {event.title}
                </h3>
                
                <p style={{ 
                  color: '#666', 
                  fontSize: '14px',
                  marginBottom: '12px',
                  flex: 1
                }}>
                  {event.description}
                </p>
                
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <ClockCircleOutlined style={{ marginRight: '8px', color: '#666' }} />
                    <span style={{ fontSize: '13px', color: '#333' }}>
                      {formatDate(event.dates[0].date)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <EnvironmentOutlined style={{ marginRight: '8px', color: '#666' }} />
                    <span style={{ fontSize: '13px', color: '#333' }}>
                      {event.dates[0].location}
                    </span>
                  </div>
                </div>
                
                {/* Special Deal Highlights */}
                {event.groupDeal && (
                  <div style={{ 
                    backgroundColor: '#f0f5ff',
                    borderLeft: '3px solid #1890ff',
                    padding: '8px 12px',
                    marginBottom: '12px',
                    borderRadius: '0 4px 4px 0'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#1890ff', marginBottom: '4px' }}>
                      Group Discount Available!
                    </div>
                    <div style={{ fontSize: '12px', color: '#333' }}>
                      Get {event.groupDeal.discount} off for groups of {event.groupDeal.minPeople}+
                    </div>
                  </div>
                )}

                {event.bundleDeal && (
                  <div style={{ 
                    backgroundColor: '#f9f0ff',
                    borderLeft: '3px solid #722ed1',
                    padding: '8px 12px',
                    marginBottom: '12px',
                    borderRadius: '0 4px 4px 0'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#722ed1', marginBottom: '4px' }}>
                      Bundle Includes:
                    </div>
                    <ul style={{ 
                      fontSize: '12px', 
                      color: '#333',
                      margin: 0,
                      paddingLeft: '16px'
                    }}>
                      {event.bundleDeal.includes.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div style={{ 
                  backgroundColor: '#fff9e6',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  border: '1px dashed #e1c71a'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', color: '#021529' }}>{event.pricingTiers[0].name}</span>
                    <Tag color="#ff4d4f" style={{ fontWeight: 'bold' }}>
                      {event.pricingTiers[0].discount}
                    </Tag>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold',
                      color: '#021529'
                    }}>
                      {formatPrice(event.pricingTiers[0].dealPrice)}
                    </span>
                    <span style={{ 
                      fontSize: '14px', 
                      textDecoration: 'line-through',
                      color: '#999'
                    }}>
                      {formatPrice(event.pricingTiers[0].originalPrice)}
                    </span>
                  </div>
                  
                  <div style={{ marginTop: '8px' }}>
                    <Progress 
                      percent={Math.round((event.pricingTiers[0].sold / event.pricingTiers[0].capacity) * 100)} 
                      size="small" 
                      strokeColor="#ffd72d"
                      trailColor="#f0f0f0"
                      showInfo={false}
                    />
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      <span>{event.pricingTiers[0].sold} sold</span>
                      <span>{event.pricingTiers[0].capacity - event.pricingTiers[0].sold} left</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  backgroundColor: '#f5f5f5',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  marginBottom: '16px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <span style={{ color: '#666' }}>Deal ends:</span>
                    <span style={{ fontWeight: 'bold', color: '#ff4d4f' }}>
                      {formatDate(event.dealEnds)}
                    </span>
                  </div>
                </div>
                
                <Button 
                  type="primary" 
                  block 
                  style={{
                    backgroundColor: '#021529',
                    borderColor: '#021529',
                    fontWeight: 'bold',
                    color: '#ffd72d',
                    borderRadius: '6px',
                    height: '40px'
                  }}
                  onClick={() => showDealDetails(event)}
                >
                  View Deal Details
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      
  

      {/* Deal Details Modal */}
      <Modal
        title={selectedDeal?.title}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={800}
        bodyStyle={{ padding: 0 }}
      >
        {selectedDeal && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              height: '300px',
              background: `url(${selectedDeal.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                padding: '16px 24px',
                color: '#fff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tag color={getDealBadge(selectedDeal.dealType).color} style={{ 
                    color: '#fff', 
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    {getDealBadge(selectedDeal.dealType).icon}
                    {getDealBadge(selectedDeal.dealType).text}
                  </Tag>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <StarFilled style={{ color: '#ffd72d', marginRight: '4px' }} />
                    <span>{selectedDeal.rating} ({selectedDeal.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Event Details</h3>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <ClockCircleOutlined style={{ marginRight: '8px', color: '#666' }} />
                    <span>{formatDate(selectedDeal.dates[0].date)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <EnvironmentOutlined style={{ marginRight: '8px', color: '#666' }} />
                    <span>{selectedDeal.dates[0].location}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>Deal ends:</div>
                  <div style={{ fontWeight: 'bold', color: '#ff4d4f' }}>
                    {formatDate(selectedDeal.dealEnds)}
                  </div>
                </div>
              </div>

              <Divider />

              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Deal Options</h3>
              
              <div style={{ 
                backgroundColor: '#fff9e6',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px',
                border: '1px dashed #e1c71a'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{selectedDeal.pricingTiers[0].name}</div>
                    <Tag color="#ff4d4f" style={{ fontWeight: 'bold', marginTop: '4px' }}>
                      {selectedDeal.pricingTiers[0].discount}
                    </Tag>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold',
                      color: '#021529'
                    }}>
                      {formatPrice(selectedDeal.pricingTiers[0].dealPrice)}
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      textDecoration: 'line-through',
                      color: '#999'
                    }}>
                      {formatPrice(selectedDeal.pricingTiers[0].originalPrice)}
                    </div>
                  </div>
                </div>

                <Progress 
                  percent={Math.round((selectedDeal.pricingTiers[0].sold / selectedDeal.pricingTiers[0].capacity) * 100)} 
                  showInfo={false}
                  strokeColor="#ffd72d"
                  trailColor="#f0f0f0"
                />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#666',
                  marginTop: '4px'
                }}>
                  <span>{selectedDeal.pricingTiers[0].sold} sold</span>
                  <span>{selectedDeal.pricingTiers[0].capacity - selectedDeal.pricingTiers[0].sold} tickets remaining</span>
                </div>

                {selectedDeal.groupDeal && (
                  <div style={{ 
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: 'rgba(24, 144, 255, 0.1)',
                    borderRadius: '6px',
                    borderLeft: '3px solid #1890ff'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#1890ff', marginBottom: '4px' }}>
                      Group Discount Available
                    </div>
                    <div style={{ fontSize: '14px' }}>
                      Get {selectedDeal.groupDeal.discount} off when you book for {selectedDeal.groupDeal.minPeople}+ people
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                      Only {formatPrice(selectedDeal.groupDeal.pricePerPerson)} per person!
                    </div>
                  </div>
                )}

                <Button 
                  type="primary" 
                  block 
                  size="large"
                  style={{
                    marginTop: '16px',
                    backgroundColor: '#021529',
                    borderColor: '#021529',
                    fontWeight: 'bold',
                    color: '#ffd72d',
                    height: '48px'
                  }}
                >
                  Reserve Now
                </Button>
              </div>

              <Divider />

              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>Description</h3>
              <p style={{ marginBottom: '24px' }}>{selectedDeal.description}</p>

              {selectedDeal.bundleDeal && (
                <>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>Bundle Includes</h3>
                  <ul style={{ marginBottom: '24px', paddingLeft: '20px' }}>
                    {selectedDeal.bundleDeal.includes.map((item, index) => (
                      <li key={index} style={{ marginBottom: '8px' }}>{item}</li>
                    ))}
                  </ul>
                </>
              )}

              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>Why This Deal is Special</h3>
              <ul style={{ marginBottom: '24px', paddingLeft: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Limited-time offer - save up to {selectedDeal.pricingTiers[0].discount}</li>
                <li style={{ marginBottom: '8px' }}>Only {selectedDeal.pricingTiers[0].capacity - selectedDeal.pricingTiers[0].sold} tickets left at this price</li>
                <li style={{ marginBottom: '8px' }}>Highly rated by {selectedDeal.reviewCount} attendees</li>
                {selectedDeal.isHotDeal && <li>HOT DEAL - selling fast!</li>}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Deals;














// import React, { useState, useEffect } from 'react';
// import { FireOutlined, HeartOutlined, HeartFilled, StarFilled, ThunderboltOutlined, ClockCircleOutlined, GiftOutlined, TeamOutlined, SearchOutlined, TrophyOutlined } from '@ant-design/icons';
// import { Button, Tag, Progress, Badge, Input, Modal, notification } from 'antd';
// import Confetti from 'react-confetti';

// const Deals = () => {
//   const [events, setEvents] = useState([
//     {
//       id: '1',
//       title: 'Summer Music Festival 2023',
//       category: 'Music',
//       description: 'The biggest music festival of the year featuring top artists from around the world.',
//       image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
//       dealPrice: 99.99,
//       originalPrice: 129.99,
//       discount: '23% OFF',
//       isFavorite: false,
//       isHotDeal: true,
//       dealType: 'flash-sale',
//       rating: 4.8,
//       found: false,
//       x: 15,
//       y: 30
//     },
//     {
//       id: '2',
//       title: 'Tech Innovators Conference',
//       category: 'Technology',
//       description: 'Join industry leaders as they discuss the future of technology, AI, and digital transformation.',
//       image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
//       dealPrice: 299.99,
//       originalPrice: 349.99,
//       discount: '14% OFF',
//       isFavorite: true,
//       isHotDeal: false,
//       dealType: 'early-bird',
//       rating: 4.6,
//       found: false,
//       x: 30,
//       y: 15
//     },
//     {
//       id: '3',
//       title: 'Food & Wine Experience',
//       category: 'Food',
//       description: 'A culinary journey featuring Michelin-star chefs and world-class sommeliers.',
//       image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
//       dealPrice: 149.99,
//       originalPrice: 179.99,
//       discount: '17% OFF',
//       isFavorite: false,
//       isHotDeal: true,
//       dealType: 'bundle',
//       rating: 4.9,
//       found: false,
//       x: 40,
//       y: 70
//     }
//   ]);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [visible, setVisible] = useState(false);
//   const [selectedDeal, setSelectedDeal] = useState(null);
//   const [foundCount, setFoundCount] = useState(0);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [hint, setHint] = useState('');
//   const [gameMode, setGameMode] = useState('hunt'); // 'hunt' or 'view'
//   const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

//   const toggleFavorite = (eventId) => {
//     setEvents(events.map(event => 
//       event.id === eventId ? { ...event, isFavorite: !event.isFavorite } : event
//     ));
//   };

//   const handleFoundDeal = (event) => {
//     if (!event.found) {
//       const updatedEvents = events.map(e => 
//         e.id === event.id ? { ...e, found: true } : e
//       );
//       setEvents(updatedEvents);
//       setFoundCount(foundCount + 1);
//       setSelectedDeal(event);
//       setVisible(true);
      
//       if (foundCount + 1 === events.length) {
//         setShowConfetti(true);
//         setTimeout(() => setShowConfetti(false), 5000);
//       }
//     }
//   };

//   const getDealBadge = (dealType) => {
//     switch(dealType) {
//       case 'flash-sale':
//         return { text: 'FLASH SALE', color: '#ff4d4f', icon: <ThunderboltOutlined /> };
//       case 'early-bird':
//         return { text: 'EARLY BIRD', color: '#13c2c2', icon: <ClockCircleOutlined /> };
//       case 'bundle':
//         return { text: 'BUNDLE DEAL', color: '#722ed1', icon: <GiftOutlined /> };
//       case 'group':
//         return { text: 'GROUP', color: '#52c41a', icon: <TeamOutlined /> };
//       default:
//         return { text: 'DEAL', color: '#1890ff', icon: <FireOutlined /> };
//     }
//   };

//   const handleMouseMove = (e) => {
//     setCursorPos({ x: e.clientX, y: e.clientY });
    
//     // Check if cursor is near a hidden deal
//     if (gameMode === 'hunt') {
//       events.forEach(event => {
//         if (!event.found) {
//           const distance = Math.sqrt(
//             Math.pow(e.clientX - event.x, 2) + 
//             Math.pow(e.clientY - event.y, 2)
//           );
//           if (distance < 30) {
//             setHint(`Hot deal nearby! ${distance < 15 ? 'Very close!' : ''}`);
//           }
//         }
//       });
//     }
//   };

//   const filteredEvents = events.filter(event => 
//     event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     event.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div 
//       className="event-deals-game" 
//       style={{ 
//         padding: '24px', 
//         maxWidth: '1400px', 
//         margin: '0 auto',
//         minHeight: '100vh',
//         position: 'relative',
//         overflow: 'hidden'
//       }}
//       onMouseMove={handleMouseMove}
//     >
//       {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

//       {/* Game Header */}
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'space-between', 
//         alignItems: 'center',
//         marginBottom: '24px',
//         padding: '16px',
//         backgroundColor: '#021529',
//         borderRadius: '12px',
//         color: '#ffd72d'
//       }}>
//         <h1 style={{ margin: 0, fontSize: '24px' }}>
//           <FireOutlined style={{ marginRight: '8px' }} />
//           Deal Hunter Adventure
//         </h1>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//           <Tag color="#ffd72d" style={{ color: '#021529', fontWeight: 'bold' }}>
//             <TrophyOutlined /> Found: {foundCount}/{events.length}
//           </Tag>
//           <Button 
//             type={gameMode === 'hunt' ? 'primary' : 'default'}
//             onClick={() => setGameMode('hunt')}
//             style={{
//               backgroundColor: gameMode === 'hunt' ? '#ffd72d' : undefined,
//               borderColor: gameMode === 'hunt' ? '#ffd72d' : undefined,
//               color: gameMode === 'hunt' ? '#021529' : undefined
//             }}
//           >
//             Hunt Mode
//           </Button>
//           <Button 
//             type={gameMode === 'view' ? 'primary' : 'default'}
//             onClick={() => setGameMode('view')}
//             style={{
//               backgroundColor: gameMode === 'view' ? '#ffd72d' : undefined,
//               borderColor: gameMode === 'view' ? '#ffd72d' : undefined,
//               color: gameMode === 'view' ? '#021529' : undefined
//             }}
//           >
//             View All
//           </Button>
//         </div>
//       </div>

//       {/* Search and Instructions */}
//       <div style={{ marginBottom: '24px' }}>
//         <Input
//           placeholder="Search deals..."
//           prefix={<SearchOutlined />}
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{ maxWidth: '400px' }}
//         />
//         {gameMode === 'hunt' && (
//           <div style={{ marginTop: '8px', color: '#666', fontStyle: 'italic' }}>
//             Move your cursor around the screen to hunt for hidden deals! {hint}
//           </div>
//         )}
//       </div>

//       {/* Game Board */}
//       <div style={{ 
//         position: 'relative',
//         minHeight: '600px',
//         border: gameMode === 'hunt' ? '2px dashed #e1c71a' : 'none',
//         borderRadius: '12px',
//         backgroundColor: gameMode === 'hunt' ? '#f9f9f9' : 'transparent',
//         padding: gameMode === 'view' ? '0' : '24px'
//       }}>
//         {gameMode === 'hunt' ? (
//           <>
//             {/* Hidden deals (only visible when found) */}
//             {events.map(event => (
//               <div
//                 key={event.id}
//                 style={{
//                   position: 'absolute',
//                   left: `${event.x}%`,
//                   top: `${event.y}%`,
//                   transform: 'translate(-50%, -50%)',
//                   transition: 'all 0.3s',
//                   opacity: event.found ? 1 : 0,
//                   pointerEvents: event.found ? 'auto' : 'none',
//                   cursor: 'pointer'
//                 }}
//                 onClick={() => {
//                   setSelectedDeal(event);
//                   setVisible(true);
//                 }}
//               >
//                 <div style={{
//                   width: '120px',
//                   height: '120px',
//                   backgroundImage: `url(${event.image})`,
//                   backgroundSize: 'cover',
//                   backgroundPosition: 'center',
//                   borderRadius: '8px',
//                   border: '2px solid #ffd72d',
//                   boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
//                 }} />
//               </div>
//             ))}

//             {/* Radar pulse animation at cursor */}
//             <div style={{
//               position: 'absolute',
//               left: `${cursorPos.x}px`,
//               top: `${cursorPos.y}px`,
//               transform: 'translate(-50%, -50%)',
//               width: '40px',
//               height: '40px',
//               borderRadius: '50%',
//               border: '2px solid rgba(255, 215, 45, 0.5)',
//               animation: 'pulse 2s infinite',
//               pointerEvents: 'none'
//             }} />

//             {/* Hidden deal indicators (only visible when nearby) */}
//             {events.map(event => (
//               !event.found && (
//                 <div
//                   key={`indicator-${event.id}`}
//                   style={{
//                     position: 'absolute',
//                     left: `${event.x}%`,
//                     top: `${event.y}%`,
//                     transform: 'translate(-50%, -50%)',
//                     width: '100px',
//                     height: '100px',
//                     borderRadius: '50%',
//                     backgroundColor: Math.sqrt(
//                       Math.pow(cursorPos.x - event.x, 2) + 
//                       Math.pow(cursorPos.y - event.y, 2)
//                     ) < 50 ? 'rgba(255, 215, 45, 0.3)' : 'transparent',
//                     transition: 'background-color 0.3s',
//                     pointerEvents: 'none'
//                   }}
//                 />
//               )
//             ))}

//             {/* Clickable areas for hidden deals */}
//             {events.map(event => (
//               !event.found && (
//                 <div
//                   key={`clickable-${event.id}`}
//                   style={{
//                     position: 'absolute',
//                     left: `${event.x}%`,
//                     top: `${event.y}%`,
//                     transform: 'translate(-50%, -50%)',
//                     width: '40px',
//                     height: '40px',
//                     borderRadius: '50%',
//                     cursor: 'pointer',
//                     zIndex: 10
//                   }}
//                   onClick={() => handleFoundDeal(event)}
//                 />
//               )
//             ))}

//             {/* Instructions overlay */}
//             {foundCount === 0 && (
//               <div style={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//                 textAlign: 'center',
//                 maxWidth: '400px',
//                 backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                 padding: '24px',
//                 borderRadius: '12px',
//                 boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
//               }}>
//                 <h3 style={{ color: '#021529' }}>Welcome to Deal Hunter!</h3>
//                 <p>Move your cursor around the screen to find hidden event deals.</p>
//                 <p>When you get close to a deal, you'll see a hint.</p>
//                 <p>Click when you think you've found one!</p>
//                 <Button 
//                   type="primary" 
//                   style={{ 
//                     marginTop: '16px',
//                     backgroundColor: '#021529',
//                     borderColor: '#021529',
//                     color: '#ffd72d'
//                   }}
//                 >
//                   Start Hunting
//                 </Button>
//               </div>
//             )}
//           </>
//         ) : (
//           /* View All Mode - Scattered but visible deals */
//           <div style={{ 
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
//             gap: '24px'
//           }}>
//             {filteredEvents.map(event => (
//               <div 
//                 key={event.id}
//                 style={{
//                   backgroundColor: '#fff',
//                   borderRadius: '12px',
//                   overflow: 'hidden',
//                   border: '1px solid #e1c71a',
//                   boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//                   transition: 'all 0.3s',
//                   cursor: 'pointer'
//                 }}
//                 onClick={() => {
//                   setSelectedDeal(event);
//                   setVisible(true);
//                 }}
//               >
//                 <div style={{ 
//                   height: '160px',
//                   backgroundImage: `url(${event.image})`,
//                   backgroundSize: 'cover',
//                   backgroundPosition: 'center',
//                   position: 'relative'
//                 }}>
//                   <div style={{ 
//                     position: 'absolute',
//                     top: '12px',
//                     left: '12px'
//                   }}>
//                     <Tag color={getDealBadge(event.dealType).color} style={{ 
//                       color: '#fff',
//                       fontWeight: 'bold',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '4px'
//                     }}>
//                       {getDealBadge(event.dealType).icon}
//                       {getDealBadge(event.dealType).text}
//                     </Tag>
//                   </div>
//                   <div 
//                     style={{
//                       position: 'absolute',
//                       top: '12px',
//                       right: '12px',
//                       cursor: 'pointer',
//                       backgroundColor: 'rgba(255,255,255,0.8)',
//                       width: '32px',
//                       height: '32px',
//                       borderRadius: '50%',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       zIndex: 2
//                     }}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleFavorite(event.id);
//                     }}
//                   >
//                     {event.isFavorite ? (
//                       <HeartFilled style={{ color: '#ff4d4f', fontSize: '16px' }} />
//                     ) : (
//                       <HeartOutlined style={{ color: '#021529', fontSize: '16px' }} />
//                     )}
//                   </div>
//                 </div>
//                 <div style={{ padding: '16px' }}>
//                   <h3 style={{ 
//                     margin: '0 0 8px 0', 
//                     fontSize: '18px', 
//                     fontWeight: 'bold',
//                     color: '#021529'
//                   }}>
//                     {event.title}
//                   </h3>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
//                     <Tag color="#021529" style={{ color: '#ffd72d', fontWeight: 'bold' }}>
//                       {event.category}
//                     </Tag>
//                     <div style={{ display: 'flex', alignItems: 'center' }}>
//                       <StarFilled style={{ color: '#ffd72d', marginRight: '4px' }} />
//                       <span>{event.rating}</span>
//                     </div>
//                   </div>
//                   <div style={{ 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     justifyContent: 'space-between',
//                     marginTop: '12px'
//                   }}>
//                     <div>
//                       <span style={{ 
//                         fontSize: '18px', 
//                         fontWeight: 'bold',
//                         color: '#021529'
//                       }}>
//                         ${event.dealPrice.toFixed(2)}
//                       </span>
//                       <span style={{ 
//                         fontSize: '14px', 
//                         textDecoration: 'line-through',
//                         color: '#999',
//                         marginLeft: '8px'
//                       }}>
//                         ${event.originalPrice.toFixed(2)}
//                       </span>
//                     </div>
//                     <Tag color="#ff4d4f" style={{ fontWeight: 'bold' }}>
//                       {event.discount}
//                     </Tag>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Deal Details Modal */}
//       <Modal
//         title={selectedDeal?.title}
//         visible={visible}
//         onCancel={() => setVisible(false)}
//         footer={null}
//         width={800}
//         bodyStyle={{ padding: 0 }}
//       >
//         {selectedDeal && (
//           <div style={{ display: 'flex', flexDirection: 'column' }}>
//             <div style={{
//               height: '300px',
//               background: `url(${selectedDeal.image})`,
//               backgroundSize: 'cover',
//               backgroundPosition: 'center',
//               position: 'relative'
//             }}>
//               <div style={{
//                 position: 'absolute',
//                 bottom: 0,
//                 left: 0,
//                 right: 0,
//                 background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
//                 padding: '16px 24px',
//                 color: '#fff'
//               }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <Tag color={getDealBadge(selectedDeal.dealType).color} style={{ 
//                     color: '#fff', 
//                     fontWeight: 'bold',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '6px'
//                   }}>
//                     {getDealBadge(selectedDeal.dealType).icon}
//                     {getDealBadge(selectedDeal.dealType).text}
//                   </Tag>
//                   <div style={{ display: 'flex', alignItems: 'center' }}>
//                     <StarFilled style={{ color: '#ffd72d', marginRight: '4px' }} />
//                     <span>{selectedDeal.rating}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div style={{ padding: '24px' }}>
//               <p style={{ marginBottom: '24px' }}>{selectedDeal.description}</p>
              
//               <div style={{ 
//                 backgroundColor: '#fff9e6',
//                 padding: '16px',
//                 borderRadius: '8px',
//                 marginBottom: '24px',
//                 border: '1px dashed #e1c71a'
//               }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
//                   <div style={{ fontWeight: 'bold' }}>Deal Price</div>
//                   <div>
//                     <span style={{ 
//                       fontSize: '24px', 
//                       fontWeight: 'bold',
//                       color: '#021529'
//                     }}>
//                       ${selectedDeal.dealPrice.toFixed(2)}
//                     </span>
//                     <span style={{ 
//                       fontSize: '16px', 
//                       textDecoration: 'line-through',
//                       color: '#999',
//                       marginLeft: '8px'
//                     }}>
//                       ${selectedDeal.originalPrice.toFixed(2)}
//                     </span>
//                   </div>
//                 </div>

//                 <Tag color="#ff4d4f" style={{ fontWeight: 'bold', marginBottom: '16px' }}>
//                   {selectedDeal.discount} OFF
//                 </Tag>

//                 <Button 
//                   type="primary" 
//                   block 
//                   size="large"
//                   style={{
//                     backgroundColor: '#021529',
//                     borderColor: '#021529',
//                     fontWeight: 'bold',
//                     color: '#ffd72d',
//                     height: '48px'
//                   }}
//                 >
//                   {gameMode === 'hunt' ? 'Claim This Deal' : 'Get Tickets'}
//                 </Button>
//               </div>

//               {gameMode === 'hunt' && !selectedDeal.found && (
//                 <div style={{ 
//                   backgroundColor: '#f6ffed',
//                   border: '1px solid #b7eb8f',
//                   padding: '16px',
//                   borderRadius: '8px',
//                   marginBottom: '24px',
//                   textAlign: 'center'
//                 }}>
//                   <h3 style={{ color: '#389e0d' }}>You found a hidden deal!</h3>
//                   <p>Click "Claim This Deal" to secure your discount before it disappears!</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </Modal>

//       <style jsx>{`
//         @keyframes pulse {
//           0% {
//             transform: translate(-50%, -50%) scale(1);
//             opacity: 1;
//           }
//           100% {
//             transform: translate(-50%, -50%) scale(3);
//             opacity: 0;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Deals;








// import React, { useState, useEffect } from 'react';
// import { Button, Modal, Tag, notification } from 'antd';
// import { 
//   TrophyOutlined, FireOutlined, StarFilled, 
//   RollbackOutlined, HeartOutlined, EnvironmentOutlined 
// } from '@ant-design/icons';
// import Confetti from 'react-confetti';

// const Deals = () => {
//   // Game State
//   const [players, setPlayers] = useState([{ position: 0, deals: [] }]);
//   const [currentPlayer, setCurrentPlayer] = useState(0);
//   const [diceRoll, setDiceRoll] = useState(0);
//   const [gameStarted, setGameStarted] = useState(false);
//   const [gameFinished, setGameFinished] = useState(false);
//   const [showDeal, setShowDeal] = useState(false);
//   const [currentDeal, setCurrentDeal] = useState(null);
//   const [showConfetti, setShowConfetti] = useState(false);

//   // Sample Event Deals
//   const deals = [
//     {
//       id: 1,
//       title: "Summer Music Festival",
//       category: "Music",
//       discount: "30% OFF",
//       description: "Unlock VIP access to the hottest festival of the year!",
//       position: 5, // Tile number where this deal is placed
//     },
//     {
//       id: 2,
//       title: "Tech Conference",
//       category: "Technology",
//       discount: "20% OFF",
//       description: "Get early-bird pricing for the innovation summit.",
//       position: 11,
//     },
//     {
//       id: 3,
//       title: "Food & Wine Expo",
//       category: "Food",
//       discount: "25% OFF",
//       description: "Exclusive tasting passes with your discount!",
//       position: 18,
//     },
//   ];

//   // Board Tiles (24 spaces)
//   const boardTiles = Array(24).fill(null).map((_, index) => {
//     const deal = deals.find(d => d.position === index);
//     return {
//       position: index,
//       type: deal ? "DEAL" : 
//         index % 7 === 0 ? "MYSTERY" : 
//         index === 23 ? "FINISH" : "NORMAL",
//       deal,
//     };
//   });

//   // Roll Dice (1-6)
//   const rollDice = () => {
//     if (gameFinished) return;
//     const roll = Math.floor(Math.random() * 6) + 1;
//     setDiceRoll(roll);
    
//     // Move player
//     const newPlayers = [...players];
//     newPlayers[currentPlayer].position += roll;
    
//     // Check if player passed the finish line
//     if (newPlayers[currentPlayer].position >= 23) {
//       newPlayers[currentPlayer].position = 23;
//       setGameFinished(true);
//       setShowConfetti(true);
//       setTimeout(() => setShowConfetti(false), 3000);
//     }
    
//     setPlayers(newPlayers);
    
//     // Check if landed on a deal
//     const landedTile = boardTiles[newPlayers[currentPlayer].position];
//     if (landedTile.type === "DEAL") {
//       setCurrentDeal(landedTile.deal);
//       setShowDeal(true);
//       newPlayers[currentPlayer].deals.push(landedTile.deal);
//     } else if (landedTile.type === "MYSTERY") {
//       notification.info({
//         message: "Mystery Challenge!",
//         description: "Answer a trivia question to win 5% extra discount!",
//         placement: "bottomRight",
//       });
//     }
//   };

//   // Start Game
//   const startGame = () => {
//     setPlayers([{ position: 0, deals: [] }]);
//     setCurrentPlayer(0);
//     setDiceRoll(0);
//     setGameStarted(true);
//     setGameFinished(false);
//   };

//   return (
//     <div style={{ 
//       maxWidth: '800px', 
//       margin: '0 auto', 
//       padding: '24px',
//       background: '#f9f9f9',
//       borderRadius: '12px',
//       minHeight: '100vh',
//     }}>
//       {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

//       {/* Game Header */}
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'space-between', 
//         alignItems: 'center',
//         marginBottom: '24px',
//         padding: '16px',
//         background: '#021529',
//         borderRadius: '8px',
//         color: '#ffd72d',
//       }}>
//         <h1 style={{ margin: 0 }}>
//           <TrophyOutlined style={{ marginRight: '8px' }} />
//           Event Deal Board Game
//         </h1>
//         {gameStarted && (
//           <Tag color="#ffd72d" style={{ color: '#021529', fontWeight: 'bold' }}>
//             Player {currentPlayer + 1}'s Turn
//           </Tag>
//         )}
//       </div>

//       {/* Game Board */}
//       <div style={{ 
//         display: 'grid',
//         gridTemplateColumns: 'repeat(8, 1fr)',
//         gap: '8px',
//         marginBottom: '24px',
//       }}>
//         {boardTiles.map((tile, index) => (
//           <div
//             key={index}
//             style={{
//               height: '80px',
//               background: 
//                 tile.type === "FINISH" ? '#52c41a' : 
//                 tile.type === "DEAL" ? '#ffd72d' : 
//                 tile.type === "MYSTERY" ? '#722ed1' : '#fff',
//               borderRadius: '8px',
//               border: '2px solid #e1c71a',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               position: 'relative',
//               color: 
//                 tile.type === "FINISH" ? '#fff' : 
//                 tile.type === "DEAL" ? '#021529' : 
//                 tile.type === "MYSTERY" ? '#fff' : '#333',
//               fontWeight: 'bold',
//             }}
//           >
//             {index === 0 ? "START" : 
//              tile.type === "FINISH" ? "🏁 FINISH" : 
//              tile.type === "DEAL" ? "🔥 DEAL" : 
//              tile.type === "MYSTERY" ? "❓ MYSTERY" : index}

//             {/* Player Token */}
//             {players.some(p => p.position === index) && (
//               <div style={{
//                 position: 'absolute',
//                 top: '4px',
//                 right: '4px',
//                 width: '20px',
//                 height: '20px',
//                 background: '#ff4d4f',
//                 borderRadius: '50%',
//                 border: '2px solid #fff',
//               }} />
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Game Controls */}
//       {!gameStarted ? (
//         <Button 
//           type="primary" 
//           size="large" 
//           onClick={startGame}
//           style={{ 
//             background: '#021529', 
//             borderColor: '#021529',
//             color: '#ffd72d',
//             fontWeight: 'bold',
//           }}
//         >
//           Start Game
//         </Button>
//       ) : (
//         <div style={{ textAlign: 'center' }}>
//           <div style={{ marginBottom: '16px', fontSize: '18px' }}>
//             {diceRoll > 0 ? `You rolled a ${diceRoll}!` : "Roll the dice!"}
//           </div>
          
//           <Button 
//             type="primary" 
//             onClick={rollDice}
//             disabled={gameFinished}
//             style={{ 
//               background: '#ff4d4f', 
//               borderColor: '#ff4d4f',
//               fontWeight: 'bold',
//               marginRight: '12px',
//             }}
//           >
//             Roll Dice
//           </Button>
          
//           <Button 
//             icon={<RollbackOutlined />}
//             onClick={startGame}
//           >
//             Restart
//           </Button>
//         </div>
//       )}

//       {/* Player Stats */}
//       {gameStarted && (
//         <div style={{ 
//           marginTop: '24px',
//           padding: '16px',
//           background: '#fff',
//           borderRadius: '8px',
//           border: '1px solid #e1c71a',
//         }}>
//           <h3>Your Deals:</h3>
//           {players[currentPlayer].deals.length > 0 ? (
//             <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
//               {players[currentPlayer].deals.map(deal => (
//                 <Tag 
//                   key={deal.id}
//                   color="#021529"
//                   style={{ 
//                     color: '#ffd72d',
//                     padding: '8px',
//                     borderRadius: '8px',
//                   }}
//                 >
//                   <FireOutlined /> {deal.title} ({deal.discount})
//                 </Tag>
//               ))}
//             </div>
//           ) : (
//             <p>No deals yet. Keep rolling!</p>
//           )}
//         </div>
//       )}

//       {/* Game Finished Modal */}
//       {gameFinished && (
//         <Modal
//           title="🎉 You Won!"
//           visible={gameFinished}
//           onCancel={() => setGameFinished(false)}
//           footer={[
//             <Button key="close" onClick={() => setGameFinished(false)}>
//               Close
//             </Button>,
//             <Button 
//               key="claim" 
//               type="primary" 
//               style={{ 
//                 background: '#021529', 
//                 borderColor: '#021529',
//                 color: '#ffd72d',
//               }}
//             >
//               Claim VIP Pass
//             </Button>,
//           ]}
//         >
//           <p>Congratulations! You unlocked:</p>
//           <ul>
//             {players[currentPlayer].deals.map(deal => (
//               <li key={deal.id}>
//                 <strong>{deal.title}</strong> ({deal.discount})
//               </li>
//             ))}
//           </ul>
//           <p>Plus a <strong>FREE VIP upgrade</strong> for any event!</p>
//         </Modal>
//       )}

//       {/* Deal Unlocked Modal */}
//       <Modal
//         title={`🎟️ Deal Unlocked!`}
//         visible={showDeal}
//         onCancel={() => setShowDeal(false)}
//         footer={[
//           <Button key="close" onClick={() => setShowDeal(false)}>
//             Close
//           </Button>,
//           <Button 
//             key="save" 
//             type="primary" 
//             style={{ 
//               background: '#021529', 
//               borderColor: '#021529',
//               color: '#ffd72d',
//             }}
//           >
//             Save Deal
//           </Button>,
//         ]}
//       >
//         {currentDeal && (
//           <div>
//             <h3>{currentDeal.title}</h3>
//             <Tag color="#021529" style={{ color: '#ffd72d', marginBottom: '12px' }}>
//               {currentDeal.category}
//             </Tag>
//             <p>{currentDeal.description}</p>
//             <div style={{ 
//               background: '#fff9e6',
//               padding: '12px',
//               borderRadius: '8px',
//               border: '1px dashed #e1c71a',
//               marginTop: '16px',
//             }}>
//               <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
//                 {currentDeal.discount}
//               </span>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default Deals;

