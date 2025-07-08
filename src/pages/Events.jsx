import React from 'react'
import Header from '../AppLayout/Header/Header'
import AppFooter from '../ZppLayout/Footer'
import EventsList from '../components/EventList/EventList'
import EventDetails from '../pages/EventDetails/EventDetails'
function Events() {

  return (
    <div>
     <Header/>
     <h2 style={{fontSize:'24px', fontWeight:'bold',marginBottom:'16px' ,display:'flex', marginTop:'50px'}}>Upcoming Events</h2>
     <EventsList />
     <AppFooter/>
    </div>
  )
}

export default Events
