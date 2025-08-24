import React, { useEffect } from 'react';
import { 
  Card, Button, Progress, Tag, Divider, List, Avatar, Typography, 
  Spin, Alert, message, Row, Col, Layout 
} from 'antd';
import { 
  GiftOutlined, 
  FireOutlined, 
  HistoryOutlined, 
  ShoppingOutlined,
  CheckCircleOutlined,
  CrownOutlined,
  TrophyOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import useDealsStore from '../../stores/dealsStore';
import SidebarMenu from '../../AppLayout/SidebarMenu/SidebarMenu';

const { Title, Text } = Typography;
const { Sider, Content } = Layout;

const PointsDashboard = () => {
  const {
    pointsBalance,
    pointsHistory,
    redemptionOptions,
    userLevelInfo,
    loading,
    error,
    fetchPointsBalance,
    fetchPointsHistory,
    fetchRedemptionOptions,
    fetchUserLevelInfo,
    redeemPoints
  } = useDealsStore();

  useEffect(() => {
    fetchPointsBalance();
    fetchRedemptionOptions();
    fetchPointsHistory();
    fetchUserLevelInfo();
  }, []);

  const handleRedeem = async (reward) => {
    try {
      const result = await redeemPoints(reward.id);
      message.success(result.message || `Successfully redeemed ${reward.discount}`);
    } catch (error) {
      console.error('Redemption failed:', error);
      message.error(error.message || 'Failed to redeem reward');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'Gold Member': return <CrownOutlined style={{ color: '#ffd700', fontSize: '24px' }} />;
      case 'Silver Member': return <TrophyOutlined style={{ color: '#c0c0c0', fontSize: '24px' }} />;
      default: return <TrophyOutlined style={{ color: '#cd7f32', fontSize: '24px' }} />;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Gold Member': return '#ffd700';
      case 'Silver Member': return '#6f6d6dff';
      default: return '#cd7f32';
    }
  };

  const renderActivityItem = (activity) => {
    const isEarned = activity.points > 0;
    const isRecent = new Date() - new Date(activity.createdAt) < 24 * 60 * 60 * 1000;
    
    return (
      <List.Item>
        <List.Item.Meta
          avatar={
            <Avatar 
              style={{ backgroundColor: isEarned ? '#f8ba00ff' : '#04305fff' }}
              icon={isEarned ? <ShoppingOutlined /> : <GiftOutlined />} 
            />
          }
          title={
            <div>
              <Text strong>
                {isEarned ? `Earned ${activity.points} points` : `Redeemed ${Math.abs(activity.points)} points`}
              </Text>
              <div>
                <Text type="secondary">
                  {activity.event?.title || (isEarned ? 'Ticket purchase' : 'Reward redemption')}
                </Text>
              </div>
            </div>
          }
          description={
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {formatDate(activity.createdAt)}
              {isRecent && <Tag color="green" style={{ marginLeft: '8px' }}>New</Tag>}
            </Text>
          }
        />
        <Tag color={isEarned ? 'green' : 'blue'}>
          {isEarned ? `+${activity.points}` : `-${Math.abs(activity.points)}`}
        </Tag>
      </List.Item>
    );
  };

  if (loading && !pointsBalance) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: 'white' }}>
      <Sider 
        width={250} 
        style={{ 
          background: 'white',
         
        }}
      >
        <SidebarMenu />
      </Sider>
      <Layout>
        <Content style={{ padding: '24px', background: '#fff', }}>
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              closable
              onClose={() => useDealsStore.getState().clearError()}
              style={{ marginBottom: '24px' }}
            />
          )}

          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Title level={2}>
              <FireOutlined style={{ color: '#ffd72d', marginRight: '12px' }} />
              Ticket Rewards
            </Title>
            <Text type="secondary">
              Earn 10 points with every ticket purchase and redeem them for rewards
            </Text>
          </div>

          <Row gutter={24} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={12}>
              <Card 
                style={{ 
                  background: 'linear-gradient(135deg, #021529 0%, #034078 100%)',
                  border: 'none',
                  color: 'white'
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  {userLevelInfo && getLevelIcon(userLevelInfo.level)}
                  <Title 
                    level={3} 
                    style={{ 
                      color: 'white', 
                      margin: '8px 0',
                      fontWeight: 600
                    }}
                  >
                    {userLevelInfo?.level || 'Bronze Member'} - {pointsBalance?.availablePoints || 0} Points
                  </Title>
                </div>
                <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.2)', margin: '16px 0' }} />
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <Text strong style={{ color: 'white' }}>Total Points Earned:</Text>
                    <Tag color="#1890ff" style={{ color: 'white', fontWeight: 'bold', border: 'none' }}>
                      {pointsBalance?.totalPointsEarned || 0}
                    </Tag>
                  </div>
                  
                  {userLevelInfo && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Progress to {userLevelInfo.nextLevel}:</Text>
                        <Text strong style={{ color: 'white' }}>{userLevelInfo.progress}%</Text>
                      </div>
                      <Progress 
                        percent={userLevelInfo.progress} 
                        showInfo={false} 
                        strokeColor={getLevelColor(userLevelInfo.level)}
                        trailColor="rgba(255, 255, 255, 0.2)"
                      />
                    </>
                  )}
                </div>
              </Card>
            </Col>

          <Col xs={24} lg={12}>
            <Card 
              style={{ 
                background: 'linear-gradient(135deg, #021529 0%, #034078 100%)',
                border: 'none',
                color: 'white'
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <Title level={4} style={{ color: 'white', marginBottom: '16px' }}>
                <InfoCircleOutlined style={{ marginRight: '8px', color: '#e8a807ff', fontSize:'20px'}} />
                How It Works
              </Title>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <Avatar size="small" style={{ backgroundColor: '#966400ff', marginRight: '8px', color: 'white' }}>1</Avatar>
                  <Text style={{ color: 'white' }}>Purchase tickets for events</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <Avatar size="small" style={{ backgroundColor: '#d38e04ff', marginRight: '8px', color: 'white' }}>2</Avatar>
                  <Text style={{ color: 'white' }}>Earn 10 points per ticket</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <Avatar size="small" style={{ backgroundColor: '#f8a707ff', marginRight: '8px', color: 'white' }}>3</Avatar>
                  <Text style={{ color: 'white' }}>Redeem points for discounts</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

          <Row gutter={24}>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <span>
                    <GiftOutlined style={{ marginRight: '8px' }} />
                    Available Rewards
                  </span>
                }
                loading={loading}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {redemptionOptions.map((reward, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        padding: '16px', 
                        border: '1px solid #6f6d6dff', 
                        borderRadius: '8px',
                        opacity: (pointsBalance?.availablePoints || 0) >= reward.points ? 1 : 0.6
                      }}
                    >
                      <Title level={5} style={{ marginBottom: '4px' }}>{reward.discount}</Title>
                      <Text type="secondary">{reward.points} points required</Text>
                      <div style={{ marginTop: '12px' }}>
                      <Button
                        className='dark-btn'
                        icon={<CheckCircleOutlined />}
                        disabled={(pointsBalance?.availablePoints || 0) < reward.points}
                        loading={loading}
                        onClick={() => handleRedeem(reward)}
                        block
                      >
                        Redeem Now
                      </Button>

                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card 
                title={
                  <span>
                    <HistoryOutlined style={{ marginRight: '8px' }} />
                    Points History
                  </span>
                }
                loading={loading}
              >
                <List
                  dataSource={pointsHistory}
                  renderItem={renderActivityItem}
                  size="small"
                  style={{ maxHeight: '400px', overflow: 'auto' }}
                  locale={{ emptyText: 'No points history yet' }}
                />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PointsDashboard;