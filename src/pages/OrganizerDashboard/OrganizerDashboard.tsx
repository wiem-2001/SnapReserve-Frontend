import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Button, notification, Badge } from 'antd';
import { 
  TrophyOutlined, 
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import useOrganizerStatsStore from '../../stores/organizerStatsStore';
import './OrganizerDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

const OrganizerDashboard = () => {
  const {
    loading,
    error,
    stats,
    ticketBenMarking,
    topEvent,
    eventsPerformance,
    fetchStats,
    fetchticketBenMarking,
    fetchTopEvent,
    fetchEventsPerformance
  } = useOrganizerStatsStore();

  useEffect(() => {
    fetchStats();
    fetchticketBenMarking();
    fetchTopEvent();
    fetchEventsPerformance();
  }, []);

  useEffect(() => {
    if (stats?.earnings?.thisYear) {
      notification.success({
        message: 'Welcome to Your Dashboard!',
        description: `You've earned $${stats.earnings.thisYear} this year! Keep up the great work!`,
        placement: 'topRight',
      });
    }
  }, [stats]);

  if (loading && !stats) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-error">Error: {error}</div>;
  }

  if (!stats) {
    return null;
  }

  const audienceData = {
    labels: ['Total Attendees'],
    datasets: [
      {
        data: [stats.attendees.total],
        backgroundColor: ['#4e79a7'],
        borderWidth: 0,
      }
    ]
  };

    const lineChartData = {
    labels: ticketBenMarking.map(trend => trend.month || ''),
    datasets: [
        {
        label: 'Tickets Sold for Your Events',
        data: ticketBenMarking.map(trend => trend.yourTickets || 0),
        borderColor: '#4e79a7',
        backgroundColor: 'rgba(78, 121, 167, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#4e79a7'
        },
        {
        label: 'Average Tickets Sold Across All Events',
        data: ticketBenMarking.map(trend => trend.averageTickets || 0),
        borderColor: '#f28e2b',
        backgroundColor: 'rgba(242, 142, 43, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#f28e2b'
        }
    ]
    };


  const barChartData = {
    labels: eventsPerformance.map(event => event.event || ''),
    datasets: [
      {
        label: 'Bookings',
        data: eventsPerformance.map(event => event.bookings || 0),
        backgroundColor: '#4e79a7',
        borderColor: '#4e79a7',
        borderWidth: 1,
        borderRadius: 4
      },
      {
        label: 'Revenue ($)',
        data: eventsPerformance.map(event => event.revenue || 0),
        backgroundColor: '#f28e2b',
        borderColor: '#f28e2b',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#333',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.dataset.label === 'Revenue ($)' 
                ? `$${context.parsed.y.toLocaleString()}` 
                : context.parsed.y.toLocaleString();
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: { 
        grid: {
          display: false
        },
        ticks: { 
          color: '#666',
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      y: { 
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: { 
          color: '#666',
          font: {
            family: "'Inter', sans-serif"
          }
        }
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-header">
        <TrophyOutlined className="header-icon" />
        Event Organizer Dashboard
      </h2>

      <Row gutter={16} className="stats-row">
        <Col span={6}>
          <Card className="stat-card">
            <Statistic
              title="Yearly Earnings"
              value={stats.earnings.thisYear}
              prefix={<DollarOutlined className="earnings-icon" />}
              valueStyle={{ 
                color: '#2c3e50',
                fontSize: '28px',
                fontWeight: 600,
              }}
              suffix={
                <span className={`change-indicator ${stats.earnings.yearChange > 0 ? 'positive' : 'negative'}`}>
                  {stats.earnings.yearChange > 0 ? '+' : ''}{stats.earnings.yearChange?.toFixed(1)}%
                </span>
              }
            />
            <div className="stat-subtext">
              vs ${stats.earnings.lastYear} last year
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="stat-card">
            <Statistic
              title="Monthly Earnings"
              value={stats.earnings.thisMonth}
              prefix={<DollarOutlined className="earnings-icon" />}
              valueStyle={{ 
                color: '#2c3e50',
                fontSize: '28px',
                fontWeight: 600,
              }}
              suffix={
                <span className={`change-indicator ${stats.earnings.monthChange > 0 ? 'positive' : 'negative'}`}>
                  {stats.earnings.monthChange > 0 ? '+' : ''}{stats.earnings.monthChange?.toFixed(1)}%
                </span>
              }
            />
            <div className="stat-subtext">
              vs ${stats.earnings.lastMonth} last month
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Attendees"
              value={stats.attendees.total}
              prefix={<UserOutlined className="attendees-icon" />}
              valueStyle={{ 
                color: '#2c3e50',
                fontSize: '28px',
                fontWeight: 600,
              }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Events"
              value={stats.events.total}
              prefix={<CalendarOutlined className="events-icon" />}
              valueStyle={{ 
                color: '#2c3e50',
                fontSize: '28px',
                fontWeight: 600,
              }}
            />
            <div className="stat-subtext">
              {stats.events.upcoming} upcoming events
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="content-row">
        <Col span={16}>
          <Card title="Booking Trends" className="chart-card">
            <div className="line-chart-container">
              {ticketBenMarking.length > 0 ? (
                <Line 
                  data={lineChartData} 
                  options={{
                    ...chartOptions,
                    scales: {
                      ...chartOptions.scales,
                      x: { 
                        ...chartOptions.scales.x,
                        title: { 
                          display: true, 
                          text: 'Month', 
                          color: '#666',
                          font: {
                            family: "'Inter', sans-serif",
                            weight: '500'
                          }
                        }
                      },
                      y: { 
                        ...chartOptions.scales.y,
                        title: { 
                          display: true, 
                          text: 'Number of Bookings', 
                          color: '#666',
                          font: {
                            family: "'Inter', sans-serif",
                            weight: '500'
                          }
                        }
                      }
                    }
                  }} 
                />
              ) : (
                <div className="no-data">No booking trends data available</div>
              )}
            </div>
          </Card>

          <Card title="Event Performance" className="chart-card">
            <div className="bar-chart-container">
              {eventsPerformance.length > 0 ? (
                <Bar 
                  data={barChartData} 
                  options={{
                    ...chartOptions,
                    scales: {
                      ...chartOptions.scales,
                      x: { 
                        ...chartOptions.scales.x,
                        title: { 
                          display: true, 
                          text: 'Event', 
                          color: '#666',
                          font: {
                            family: "'Inter', sans-serif",
                            weight: '500'
                          }
                        }
                      },
                      y: { 
                        ...chartOptions.scales.y,
                        title: { 
                          display: true, 
                          text: 'Value', 
                          color: '#666',
                          font: {
                            family: "'Inter', sans-serif",
                            weight: '500'
                          }
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="no-data">No event performance data available</div>
              )}
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Event Completion" className="chart-card">
            <div className="completion-container">
              <Progress
                type="circle"
                percent={stats.completionRate}
                format={() => (
                  <div className="completion-text">
                    <div className="completion-percent">
                      {stats.completionRate}%
                    </div>
                    <div className="completion-label">
                      Completion Rate
                    </div>
                  </div>
                )}
                strokeColor={stats.completionRate > 90 ? '#27ae60' : stats.completionRate > 80 ? '#f39c12' : '#e74c3c'}
                width={180}
                strokeWidth={10}
                trailColor="#ecf0f1"
              />
              <div className={`completion-message ${stats.completionRate > 90 ? 'excellent' : stats.completionRate > 80 ? 'good' : 'poor'}`}>
                {stats.completionRate > 90 ? (
                  'Excellent completion rate!'
                ) : stats.completionRate > 80 ? (
                  'Good completion rate'
                ) : (
                  'Needs improvement'
                )}
                <div className="cancellation-rate">
                  {stats.cancellationRate}% cancellation rate
                </div>
              </div>
            </div>
          </Card>

       
          <Card title="Top Performing Event" className="chart-card">
            <div className="top-event-container">
              {topEvent ? (
                <>
                  <Badge.Ribbon text="Top Event" color="#4e79a7" >
                    <div className="top-event-card">
                      <div className="top-event-name">
                        {topEvent.eventTitle}
                      </div>
                      <div className="top-event-stat">
                        <span className="stat-label">Bookings:</span>
                        <span className="stat-value">{topEvent.bookings}</span>
                      </div>
                      <div className="top-event-stat">
                        <span className="stat-label">Revenue:</span>
                        <span className="stat-value">${topEvent.revenue?.toLocaleString()}</span>
                      </div>
                    </div>
                  </Badge.Ribbon>
                </>
              ) : (
                <div className="no-data">No top event data available</div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrganizerDashboard;