import React from 'react'
import OrganizerDashboard from './OrganizerDashboard/OrganizerDashboard'
import Header from '../AppLayout/Header/Header'
import { Layout } from 'antd'
import AppFooter from '../AppLayout/Footer'
import SidebarMenu from '../AppLayout/SidebarMenu/SidebarMenu'

function OrganizerAnalytics() {
  return (
      <div>
        <Header/>
        
        <Layout style={{ minHeight: '100vh',background: 'white' }}>
            <SidebarMenu />
            <Layout.Content style={{ padding: '0px 24px', background: '#fff' }}>
               <OrganizerDashboard />
    </Layout.Content>

    </Layout>
     <AppFooter/>
    </div>
  )
}

export default OrganizerAnalytics
