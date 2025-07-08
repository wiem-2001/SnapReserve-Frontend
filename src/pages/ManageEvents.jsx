import React from 'react'
import Header from '../AppLayout/Header/Header'
import AppFooter from '../AppLayout/Footer'
import SidebarMenu from '../AppLayout/SidebarMenu/SidebarMenu'
import { Layout } from 'antd'
import EventList from '../components/EventList/EventList'
import { Card, Button } from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
function ManageEvents() {
    const navigate = useNavigate();
  return (
    <div>
        <Header/>
        
        <Layout style={{ minHeight: '100vh',background: 'white' }}>
            <SidebarMenu />
            <Layout.Content style={{ padding: '0px 24px', background: '#fff' }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginTop: '50px',
                    marginBottom: '10px'
                }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                    My Upcoming Events
                    </h2>
                    <Button 
                            type="primary" 
                            shape="round"
                            style={{ 
                                backgroundColor: '#021529',
                                borderColor: '#021529',
                                marginTop: 16,
                                fontWeight:'initial',
                                transform: 'scale(1.05)',
                                transition: 'transform 0.2s ease',
                                color:'#ffd72d'
                            }}
                            onClick={() => navigate('/create-event')}
                            >
                                <PlusOutlined className="sidebar-icon" style={{ color:'#ffd72d'  }} />
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
