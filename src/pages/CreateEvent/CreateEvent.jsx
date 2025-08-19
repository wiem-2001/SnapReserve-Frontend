import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Space,
  Typography,
  Upload,
  message,
  Steps,
  Card,
  Row,
  Col,
  Collapse
} from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import '../CreateEvent/CreateEvent.css';
import Header from '../../AppLayout/Header/Header';
import SidebarMenu from '../../AppLayout/SidebarMenu/SidebarMenu';
import AppFooter from '../../AppLayout/Footer';
import { Layout } from 'antd';
import useEventStore from '../../stores/eventStore';
import { useNavigate } from 'react-router-dom';
import { RefundType } from '../../constants/enums';
const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;
const { Panel } = Collapse;

const defaultCategories = [
  'Festival', 'Concert', 'Movie', 'Conference', 'Workshop',
  'Theater', 'Exhibition', 'Webinar', 'Meetup', 'Sport',
];

const refundOptions = [
  { label: 'Full Refund',value: RefundType.FULL_REFUND, description: 'Full refund before a specified date.' },
  { label: 'No Refund',value: RefundType.NO_REFUND, description: 'Cannot be refunded.' },
  { label: 'Partial Refund',value: RefundType.PARTIAL_REFUND, description: 'Partial refund before a specified date.' }
];

function CreateEvent() {
  const { createEvent } = useEventStore();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image: null,
    dates: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { title: 'Basic Info', content: 'basic' },
    { title: 'Dates & Tickets', content: 'dates' },
    { title: 'Review & Submit', content: 'review' },
  ];

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case 'title':
        newErrors.title = value.trim() ? '' : 'Title is required';
        break;
      case 'category':
        newErrors.category = value ? '' : 'Category is required';
        break;
      case 'description':
        newErrors.description = value.trim() ? '' : 'Description is required';
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleDateChange = (dateIndex, key, value) => {
    const newDates = [...formData.dates];
    newDates[dateIndex][key] = value;
    setFormData(prev => ({ ...prev, dates: newDates }));
    
    validateDates(newDates);
  };

  const handlePricingChange = (dateIndex, tierIndex, key, value) => {
    const newDates = [...formData.dates];
    newDates[dateIndex].pricingTiers[tierIndex][key] = value;
    setFormData(prev => ({ ...prev, dates: newDates }));
    
    validateDates(newDates);
  };

 const addDate = () => {
  const newDate = {
    date: '',
    location: '',
    pricingTiers: [{
      name: '',
      price: '',
      capacity: '',
      refundType: RefundType.NO_REFUND 
    }]
  };
  
  setFormData(prev => ({
    ...prev,
    dates: [...prev.dates, newDate]
  }));
};

  const removeDate = (index) => {
    const newDates = formData.dates.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, dates: newDates }));
    validateDates(newDates);
  };

  const addPricingTier = (dateIndex) => {
    const newDates = [...formData.dates];
    newDates[dateIndex].pricingTiers.push({
      name: '',
      price: '',
      capacity: '',
      refundType: ''
    });
    setFormData(prev => ({ ...prev, dates: newDates }));
    validateDates(newDates);
  };

  const removePricingTier = (dateIndex, tierIndex) => {
    const newDates = [...formData.dates];
    newDates[dateIndex].pricingTiers = newDates[dateIndex].pricingTiers.filter((_, i) => i !== tierIndex);
    setFormData(prev => ({ ...prev, dates: newDates }));
    validateDates(newDates);
  };

  const validateDates = (dates) => {
  const newErrors = { ...errors };
  console.log(dates)
  if (dates.length === 0) {
    newErrors.dates = 'At least one date required';
  } else {
    const hasInvalidDates = dates.some(date => 
      !date.date || !date.location.trim()
    );
    
    const hasInvalidTiers = dates.some(date => 
      date.pricingTiers.length === 0 || 
      date.pricingTiers.some(tier => {
        const baseInvalid = !tier.name.trim() || 
                          tier.price === '' || 
                          tier.price < 0 || 
                          !tier.capacity || 
                          tier.capacity <= 0 || 
                          !tier.refundType;
        
        const refundInvalid = 
          (tier.refundType === RefundType.FULL_REFUND && !tier.refundDays) ||
          (tier.refundType === RefundType.PARTIAL_REFUND && 
           (!tier.refundDays || !tier.refundPercentage));
        
        return baseInvalid || refundInvalid;
      })
    );
    
    newErrors.dates = hasInvalidDates ? 'Fill all the required fields correctly' : 
                     hasInvalidTiers ? 'Fill all the required fields correctly' : '';
  }
  
  setErrors(newErrors);
};

  const handleImageChange = (info) => {
    const fileList = info.fileList;
    const newErrors = { ...errors };

    if (fileList.length === 0) {
      setFormData(prev => ({ ...prev, image: null }));
      newErrors.image = 'Image is required';
    } else {
      const latestFile = fileList[fileList.length - 1];
      setFormData(prev => ({ ...prev, image: latestFile.originFileObj || null }));
      newErrors.image = '';
    }
    
    setErrors(newErrors);
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.image) newErrors.image = 'Image is required';
    } else if (step === 1) {
    if (formData.dates.length === 0) {
      newErrors.dates = 'Please add at least one event date';
    } else {
      validateDates(formData.dates);
      if (errors.dates) newErrors.dates = errors.dates;
    }
  }

    setErrors(newErrors);
    return Object.keys(newErrors).filter(k => newErrors[k]).length === 0;
  };

  const next = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      message.error('Please fill all required fields before proceeding');
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      message.error('Please fix all errors before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = new FormData();
      submissionData.append('title', formData.title);
      submissionData.append('category', formData.category);
      submissionData.append('description', formData.description);
      submissionData.append('image', formData.image);
      submissionData.append('dates', JSON.stringify(formData.dates));
      
      await createEvent(submissionData);
      message.success('Event created successfully!');
      navigate('/manage-events');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card title="Basic Information" style={{ marginBottom: 24 }}>
            <Form.Item
              label="Event Title"
              validateStatus={errors.title ? 'error' : ''}
              help={errors.title}
              className="custom-input"
            >
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Event Title"
              />
            </Form.Item>
            <Form.Item 
              label="Category" 
              validateStatus={errors.category ? 'error' : ''} 
              help={errors.category}
              hasFeedback
              className="custom-input"
            >
              <Select
                name="category"
                value={formData.category}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, category: value }));
                  validateField('category', value);
                }}
                placeholder="Select Category"
              >
                {defaultCategories.map(cat => (
                  <Option key={cat} value={cat}>{cat}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Description"
              validateStatus={errors.description ? 'error' : ''}
              help={errors.description}
              className="custom-input"
            >
              <TextArea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Event Description"
              />
            </Form.Item>
            <Form.Item 
              label="Event Image" 
              validateStatus={errors.image ? 'error' : ''} 
              help={errors.image}
              hasFeedback
              className="custom-input"
            >
              <Upload
                name="image"
                beforeUpload={() => false}
                accept="image/*"
                showUploadList={true}
                maxCount={1}
                onChange={handleImageChange}
                fileList={formData.image ? [{ 
                  uid: '-1', 
                  name: formData.image.name, 
                  status: 'done', 
                  originFileObj: formData.image 
                }] : []}
                onRemove={() => {
                  setFormData(prev => ({ ...prev, image: null }));
                  setErrors(prev => ({ ...prev, image: 'Image is required' }));
                }}
              >
                <Button className="light-btn" icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
              <Typography.Text type="secondary">Recommended size: 1200x630px</Typography.Text>
            </Form.Item>
          </Card>
        );
      case 1:
        return (
          <Card title="Dates & Ticket Pricing" style={{ marginBottom: 24 }}>
            {errors.dates && (
              <div className="error-message" style={{ color: '#ff4d4f', marginBottom: 10 }}>
                {errors.dates}
              </div>
            )}
            
            <Collapse accordion>
              {formData.dates.map((dateObj, dateIndex) => (
                <Panel 
                  key={dateIndex} 
                  header={`Date ${dateIndex + 1}`}
                  extra={
                    formData.dates.length > 1 && (
                      <MinusCircleOutlined 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDate(dateIndex);
                        }} 
                        style={{ color: '#ff4d4f' }} 
                      />
                    )
                  }
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Date & Time" required>
                          <DatePicker
                            showTime={{ format: 'HH:mm' }}
                            value={dateObj.date ? moment(dateObj.date) : null}
                            onChange={(date) => handleDateChange(dateIndex, 'date', date ? date.toISOString() : '')}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Location" required>
                          <Input
                            value={dateObj.location}
                            onChange={e => handleDateChange(dateIndex, 'location', e.target.value)}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Typography.Title level={5} style={{ marginTop: 16 }}>Ticket Types</Typography.Title>
                    
                    {dateObj.pricingTiers.map((tier, tierIndex) => (
                      <Card 
                        key={tierIndex} 
                        style={{ marginBottom: 16 }}
                        title={`Ticket Type ${tierIndex + 1}`}
                        extra={
                          dateObj.pricingTiers.length > 1 && (
                            <MinusCircleOutlined 
                              onClick={() => removePricingTier(dateIndex, tierIndex)} 
                              style={{ color: '#ff4d4f' }} 
                            />
                          )
                        }
                      >
                        <Row gutter={16}>
                          <Col span={8}>
                            <Form.Item label="Name" required>
                              <Input
                                value={tier.name}
                                onChange={e => handlePricingChange(dateIndex, tierIndex, 'name', e.target.value)}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label="Price ($)" required>
                              <Input
                                type="number"
                                value={tier.price}
                                onChange={e => handlePricingChange(dateIndex, tierIndex, 'price', e.target.value)}
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label="Capacity" required>
                              <Input
                                type="number"
                                value={tier.capacity}
                                onChange={e => handlePricingChange(dateIndex, tierIndex, 'capacity', e.target.value)}
                                min={1}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        
                       <Form.Item label="Refund Policy" required>
                          <Select
                            value={tier.refundType}
                            onChange={value => handlePricingChange(dateIndex, tierIndex, 'refundType', value)}
                            style={{ width: '100%' }}
                          >
                            {refundOptions.map(option => (
                              <Option key={option.value} value={option.value}>  
                                {option.label}
                              </Option>
                            ))}
                          </Select>
                          {tier.refundType && (
                            <Typography.Text type="secondary">
                              {refundOptions.find(o => o.value === tier.refundType)?.description}
                            </Typography.Text>
                          )}
                        </Form.Item>
                        
                       {tier.refundType === RefundType.FULL_REFUND && (
  <Form.Item label="Refundable Until">
    <Input
      type="number"
      placeholder="Days before event"
      value={tier.refundDays || ''}
      onChange={e => handlePricingChange(dateIndex, tierIndex, 'refundDays', e.target.value)}
      min={0}
      addonAfter="days before"
    />
  </Form.Item>
                          )}

                        {tier.refundType === RefundType.PARTIAL_REFUND && (
                          <>
                            <Form.Item label="Refundable Until">
                              <Input
                                type="number"
                                placeholder="Days before event"
                                value={tier.refundDays || ''}
                                onChange={e => handlePricingChange(dateIndex, tierIndex, 'refundDays', e.target.value)}
                                min={0}
                                addonAfter="days before"
                              />
                            </Form.Item>
                            <Form.Item label="Refund Percentage">
                              <Input
                                type="number"
                                placeholder="Percentage"
                                value={tier.refundPercentage || ''}
                                onChange={e => handlePricingChange(dateIndex, tierIndex, 'refundPercentage', e.target.value)}
                                min={0}
                                max={100}
                                addonAfter="%"
                              />
                            </Form.Item>
                          </>
                        )}
                      </Card>
                    ))}
                    
                    <Button 
                      type="dashed" 
                      onClick={() => addPricingTier(dateIndex)} 
                      icon={<PlusOutlined />} 
                      style={{ width: '100%' }}
                    >
                      Add Ticket Type
                    </Button>
                  </Space>
                </Panel>
              ))}
            </Collapse>
            
            <Button 
              type="dashed" 
              onClick={addDate} 
              icon={<PlusOutlined />} 
              style={{ width: '100%', marginTop: 16 }}
            >
              Add Another Date
            </Button>
          </Card>
        );
      case 2:
        return (
          <Card title="Review Your Event" style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 24 }}>
              <Typography.Title level={5}>Basic Information</Typography.Title>
              <Typography.Paragraph><strong>Title:</strong> {formData.title}</Typography.Paragraph>
              <Typography.Paragraph><strong>Category:</strong> {formData.category}</Typography.Paragraph>
              <Typography.Paragraph><strong>Description:</strong> {formData.description}</Typography.Paragraph>
              {formData.image && (
                <Typography.Paragraph><strong>Image:</strong> {formData.image.name}</Typography.Paragraph>
              )}
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <Typography.Title level={5}>Dates & Ticket Pricing</Typography.Title>
              {formData.dates.map((date, dateIndex) => (
                <div key={dateIndex} style={{ marginBottom: 24 }}>
                  <Typography.Title level={5}>
                    Date {dateIndex + 1}: {moment(date.date).format('LLL')} at {date.location}
                  </Typography.Title>
                  
                  {date.pricingTiers.map((tier, tierIndex) => (
                    <div key={tierIndex} style={{ marginLeft: 16, marginBottom: 16 }}>
                      <Typography.Paragraph>
                        <strong>Ticket {tierIndex + 1}:</strong> {tier.name} - ${tier.price} (Capacity: {tier.capacity})
                      </Typography.Paragraph>
                      <Typography.Paragraph>
                      <strong>Refund Policy:</strong> {refundOptions.find(o => o.value === tier.refundType)?.label}
                      {tier.refundType === RefundType.FULL_REFUND && tier.refundDays && (
                        <span> - Refundable until {tier.refundDays} days before event</span>
                      )}
                      {tier.refundType === RefundType.PARTIAL_REFUND && tier.refundDays && tier.refundPercentage && (
                        <span> - {tier.refundPercentage}% refund until {tier.refundDays} days before event</span>
                      )}
                    </Typography.Paragraph>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Header />
      <Layout style={{ minHeight: '100vh', background: 'white' }}>
        <SidebarMenu />
        <Layout.Content style={{ padding: '0px 24px', background: '#fff' }}>
          <div style={{ maxWidth: '800px', margin: '50px auto', padding: '0px' }}>
            <div style={{ marginBottom: '40px' }}>
              <Typography.Title level={2} style={{ marginBottom: 0 }}>Create an Event</Typography.Title>
              <Typography.Text type="secondary">
                Fill in the details below to create your event
              </Typography.Text>
            </div>
            
            <Steps current={currentStep} style={{ marginBottom: 32 }}>
              {steps.map(item => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
            
            {renderStepContent()}
            
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
              {currentStep > 0 && (
                <Button style={{ margin: '0 8px' }} className='light-btn' onClick={prev}>
                  Previous
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button className='dark-btn' onClick={next}>
                  Next
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button 
                  className='dark-btn'
                  onClick={handleSubmit}
                  loading={isSubmitting}
                >
                  Create Event
                </Button>
              )}
            </div>
          </div>
        </Layout.Content>
      </Layout>
      <AppFooter />
    </div>
  );
}

export default CreateEvent;