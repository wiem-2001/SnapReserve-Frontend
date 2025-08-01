import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import EventCard from '../EventCard/EventCard';
import './RecommendedEvents.css';
import { Flex } from 'antd';

function RecommendedEvents({ events = [] }) {
  const sliderRef = useRef<InstanceType<typeof Slider> | null>(null);
  const limitedEvents = events.slice(0, 5);
  const settings = {
  className: "center",
  centerMode: false,
  infinite: false, 
  centerPadding: "0px",
  slidesToShow: Math.min(events.length, 2),
  speed: 500,
  dots: true,
  arrows: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: Math.min(events.length, 2),
        centerPadding: "0px"
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        centerPadding: "0px"
      }
    }
  ]
};


  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(0);
      console.log('RecommendedEvents count:', events.length);


    }
  }, [events]);

  return (
    <div className="slider-container">
      <h2 className="section-title" style={{display:'flex',justifyContent:'left'}}>Recommended For You</h2>
      {limitedEvents.length > 0 ? (
        <Slider ref={sliderRef} {...settings}>
          {limitedEvents.map((event) => (
            <div key={event.id} className="event-slide">
              <EventCard event={event} onDelete={undefined} />
            </div>
          ))}
        </Slider>
      ) : (
        <p>No recommendations available.</p>
      )}
    </div>
  );
}

export default RecommendedEvents;
