import React, { useState, useEffect } from 'react';
import {
  DatePicker,
  Input,
  Slider,
  Pagination,
  Dropdown,
  Button,
  Menu,
  Typography,
  Divider ,
  message,
} from 'antd';
import debounce from 'lodash/debounce';
import dayjs from 'dayjs';

import EventCard from '../EventCard/EventCard';
import './EventListCss.css';
import useEventStore from '../../stores/eventStore';
import useAuthStore from '../../stores/authStore';
import RecommendedEvents from '../RecommendedEvents/RecommendedEvents';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const defaultCategories = [
  'Festival',
  'Concert',
  'Movie',
  'Conference',
  'Workshop',
  'Theater',
  'Exhibition',
  'Webinar',
  'Meetup',
  'Sport',
];

const EventList = () => {
  const [filters, setFilters] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { events, fetchEvents, fetchOrganizerEvents , recommendations,fetchRecommendations} = useEventStore();
  const { user: authUser, getMe } = useAuthStore();

useEffect(() => {
  const loadUser = async () => {
    try {
      await getMe();     
    } catch {
      
    }
  };
  loadUser();
}, [getMe]);

useEffect(() => {
  if (authUser?.user?.role === 'organizer') {
    fetchOrganizerEvents(filters);
  } else {
    fetchEvents(filters);
  }
}, [filters, authUser?.user?.role, fetchEvents, fetchOrganizerEvents]);

useEffect(() => {
  if (authUser?.user?.role === 'attendee') {
    fetchRecommendations();
  }
}, [authUser?.user?.role, fetchRecommendations]);

useEffect(() => {
}, [recommendations]);

  const handleKeywordChange = debounce((value) => {
    setFilters((prev) => ({ ...prev, keyword: value || undefined }));
  }, 500);

  const handleCategorySelect = (key) => {
    const newCategory = key === selectedCategory ? null : key;
    setSelectedCategory(newCategory);
    setFilters((prev) => ({
      ...prev,
      category: newCategory || undefined,
    }));
  };

  const handleDateChange = (dates) => {
    if (!dates || dates.length === 0) {
      setFilters((prev) => ({ ...prev, dateRange: undefined }));
    } else {
      const [start, end] = dates;
      setFilters((prev) => ({
        ...prev,
        dateRange: [
          dayjs(start).toISOString(),
          dayjs(end).toISOString(),
        ],
      }));
    }
  };

  const clearAllFilters = () => {
    setFilters({});
    setSelectedCategory(null);
  };

  const categoryMenu = (
    <Menu onClick={({ key }) => handleCategorySelect(key)}>
      {defaultCategories.map((cat) => (
        <Menu.Item key={cat}>{cat}</Menu.Item>
      ))}
    </Menu>
  );

  return (

    <div className="event-list-container">
      {authUser?.user?.role === 'attendee' && (
       <di>
          <RecommendedEvents events={recommendations} />
          <h2 style={{marginBottom:'50px'}}>Upcomming Events</h2>
       </di>
      )}

 
      <div className="filter-bar">
        <Input
          placeholder="Search events"
          className="filter-input search-input"
          onChange={(e) => handleKeywordChange(e.target.value)}
        />

        <Dropdown overlay={categoryMenu} trigger={['click']}>
          <Button className="filter-button" style={{ color: '#021529' }}>
            {selectedCategory || 'Select Category'}
          </Button>
        </Dropdown>

        <div className="filter-input">
          <Text style={{ color: '#021529', marginRight: '10px' }}>
            Filter by Event Date
          </Text>
          <RangePicker
            value={
              filters.dateRange
                ? [dayjs(filters.dateRange[0]), dayjs(filters.dateRange[1])]
                : null
            }
            onChange={handleDateChange}
          />
        </div>

        <Button onClick={clearAllFilters}>Clear All Filters</Button>
      </div>
      
      {events.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
          No events found for the selected filters.
        </div>
      ) : (
        <div className="event-grid">
          {events.map((event) => (
            <ul key={event.id}>
              <EventCard event={event} />
            </ul>
          ))}
        </div>
      )}

      <div className="pagination-container">
        <Pagination
          total={50}
          className="custom-pagination"
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default EventList;
