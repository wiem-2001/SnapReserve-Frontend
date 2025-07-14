import React from 'react'
import Header from '../AppLayout/Header/Header'
import { Layout } from 'antd'
import SidebarMenu from '../AppLayout/SidebarMenu/SidebarMenu'
import AppFooter from '../AppLayout/Footer'
import EventDetails from './EventDetails/EventDetails'

function OrganizerEventDetails() {
  return (
    <div>
       
        
        <Layout style={{ minHeight: '100vh',background: 'white' }}>
            <SidebarMenu />
            <Layout.Content style={{ padding: '0px 24px', background: '#fff' }}>
            

                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
           <EventDetails/>
    </div>
    </Layout.Content>

    </Layout>

    </div>
  )
}

export default OrganizerEventDetails
