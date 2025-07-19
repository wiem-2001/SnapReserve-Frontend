import React from 'react'
import Header from '../AppLayout/Header/Header'
import AppFooter from '../AppLayout/Footer'
import EventsList from '../components/EventList/EventList'
import EventDetails from '../pages/EventDetails/EventDetails'
import { Typography, } from 'antd'
function Events() {

  return (
    <div>
     <Header/>
    
     <EventsList style={{ marginLeft:'50px'}} />
     <AppFooter/>
    </div>
  )
}

export default Events
