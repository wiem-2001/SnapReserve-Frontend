import React from 'react'

import AppFooter from '../AppLayout/Footer'
import EventList from '../components/EventCard'
import Header from '../AppLayout/Header/Header'


function Default() {
  return (
    <div>
      <Header />
      <EventList />
      <AppFooter />
    </div>
  )
}

export default Default
