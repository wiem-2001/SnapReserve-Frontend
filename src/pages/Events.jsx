import React from 'react'
import Header from '../AppLayout/Header/Header'
import AppFooter from '../AppLayout/Footer'
import EventsList from '../components/EventList/EventList'
import EventDetails from '../pages/EventDetails/EventDetails'
function Events() {

  return (
    <div>
     <Header/>
     <h2 style={{fontSize:'24px', fontWeight:'bold',marginBottom:'16px' ,display:'flex', marginTop:'50px', marginLeft:'50px'}}>Upcoming Events</h2>
     <EventsList style={{ marginLeft:'50px'}} />
     <AppFooter/>
    </div>
  )
}

export default Events
