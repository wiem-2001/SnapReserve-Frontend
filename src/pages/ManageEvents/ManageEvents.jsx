import React from 'react'
import Header from '../../AppLayout/Header/Header'
import AppFooter from '../../AppLayout/Footer'
import SidebarMenu from '../../AppLayout/SidebarMenu/SidebarMenu'
import { Layout } from 'antd'
import EventList from '../../components/EventList/EventList'
import { Card, Button } from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './ManageEvents.css';

function ManageEvents() {
    const navigate = useNavigate();
  return (
    <div>
        <Header/>
        
        <Layout style={{ minHeight: '100vh',background: 'white' }}>
            <SidebarMenu />
            <Layout.Content style={{ padding: '0px 55px', background: '#fff' }}>
               <div className="manage-events-header">
                <h2 className="manage-events-title">My Upcoming Events</h2>
                    <Button 
                        type="primary" 
                        shape="round"
                        className="create-event-button"
                        onClick={() => navigate('/create-event')}
                    >
                        <PlusOutlined className="sidebar-icon" style={{ color: '#ffd72d' }} />
                        Create an Event
                    </Button>
                    </div>


                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <EventList />
    </div>
    </Layout.Content>

    </Layout>
     <AppFooter/>
    </div>
  )
}

export default ManageEvents
