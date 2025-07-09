import React, { useState } from 'react';
import { DatePicker, Input, Slider, Pagination, Dropdown, Button, Menu } from 'antd';
import EventCard from '../EventCard';
import './EventListCss.css';
import useEventStore from '../../stores/eventStore';
import { useEffect } from 'react';

const { RangePicker } = DatePicker;

const EventList = () => {
  const [filters, setFilters] = useState({});
  const { events, fetchEvents, loading, error } = useEventStore();

  const handleMenuClick = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  useEffect(() => {
    fetchEvents(filters); 
  }, [filters]);

  const categoryMenu = (
    <Menu onClick={({ key }) => handleMenuClick('category', key)}>
      <Menu.Item key="concert">Concert</Menu.Item>
      <Menu.Item key="sports">Sports</Menu.Item>
      <Menu.Item key="conference">Conference</Menu.Item>
    </Menu>
  );

  const locationMenu = (
    <Menu onClick={({ key }) => handleMenuClick('location', key)}>
      <Menu.Item key="San Francisco">San Francisco</Menu.Item>
      <Menu.Item key="New York">New York</Menu.Item>
    </Menu>
  );

  return (
    <div className="event-list-container">
      
      <div className="filter-bar">
        <Input
          placeholder="search events"
          className="filter-input search-input"
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
        />
        <Dropdown overlay={categoryMenu} trigger={['click']}>
          <Button className="filter-button" style={{color:'#021529'}}>Event Category</Button>
        </Dropdown>
        <Dropdown overlay={locationMenu} trigger={['click']}>
          <Button className="filter-button" style={{color:'#021529'}}>Location</Button>
        </Dropdown>
        <RangePicker
          className="filter-input"
          onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
        />
        <div className="price-slider">
          <span>Price Range:</span>
          <Slider
            range
            defaultValue={[20, 100]}
            min={0}
            max={500}
            onChange={(value) => setFilters({ ...filters, priceRange: value })}
            
          />
        </div>
      </div>
          <div className="event-grid">
              {events.map(event => (
                <ul key={event.id}>
                  <EventCard event={event} />
                </ul>
              ))}
          </div>
          <div className="pagination-container" >
            <Pagination total={50} className="custom-pagination" showSizeChanger={false}  />
          </div>
    </div>
  );
};

export default EventList;
