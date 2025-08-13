import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Space,
  Typography,
  Divider,
  Upload,
  Spin,
  message,
  Image
} from 'antd';
import { LeftOutlined, MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import '../pages/Profile/Profile.css';
import { Layout } from 'antd';
import useEventStore from '../stores/eventStore';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../AppLayout/Header/Header';
import SidebarMenu from '../AppLayout/SidebarMenu/SidebarMenu';
import AppFooter from '../AppLayout/Footer';

const { TextArea } = Input;
const { Option } = Select;

const defaultCategories = [
  'Festival',
  'Concert',
  'Movie',
  'Conference',
  'Workshop',
  'Theater',
  'Exhibition',
  'Webinar',
  'Meetup',
  'Sport',
];

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { event, fetchEvent, updateEvent } = useEventStore();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image: null,
    dates: [{ date: '', location: '' }],
    pricingTiers: [{ name: '', price: '', capacity: '' }]
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadEventData = async () => {
      try {
        await fetchEvent(id);
        setLoading(false);
      } catch (error) {
        message.error('Failed to load event data');
        navigate('/getall-events');
      }
    };
    loadEventData();
  }, [id]);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        category: event.category,
        description: event.description,
        image: event.image ? { 
          uid: '-1', 
          name: event.image.split('/').pop(), 
          status: 'done',
          url: `${import.meta.env.VITE_API_URL}${event.image}`
        } : null,
        dates: event.dates?.map(d => ({
          date: moment(d.date),
          location: d.location
        })) || [{ date: null, location: '' }],
        pricingTiers: event.pricingTiers?.map(p => ({
          name: p.name,
          price: p.price.toString(),
          capacity: p.capacity.toString()
        })) || [{ name: '', price: '', capacity: '' }]
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (index, key, value) => {
    const newDates = [...formData.dates];
    newDates[index][key] = value;
    setFormData(prev => ({ ...prev, dates: newDates }));
  };

  const handlePricingChange = (index, key, value) => {
    const newPricing = [...formData.pricingTiers];
    newPricing[index][key] = value;
    setFormData(prev => ({ ...prev, pricingTiers: newPricing }));
  };

  const addDateLocation = () => {
    setFormData(prev => ({ ...prev, dates: [...prev.dates, { date: null, location: '' }] }));
  };

  const removeDateLocation = (index) => {
    const newDates = formData.dates.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, dates: newDates }));
  };

  const addPricingTier = () => {
    setFormData(prev => ({ ...prev, pricingTiers: [...prev.pricingTiers, { name: '', price: '', capacity: '' }] }));
  };

  const removePricingTier = (index) => {
    const newPricing = formData.pricingTiers.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, pricingTiers: newPricing }));
  };

  const handleImageChange = (info) => {
    const fileList = info.fileList.slice(-1); 
    const newErrors = { ...errors };

    if (fileList.length === 0) {
      setFormData(prev => ({ ...prev, image: null }));
      newErrors.image = '';
    } else {
      const file = fileList[0];
      
      if (!file.type?.startsWith('image/')) {
        message.error('You can only upload image files!');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        message.error('Image must be smaller than 5MB!');
        return;
      }

      setFormData(prev => ({ 
        ...prev, 
        image: {
          uid: file.uid,
          name: file.name,
          status: 'done',
          url: URL.createObjectURL(file.originFileObj),
          originFileObj: file.originFileObj
        }
      }));
      newErrors.image = '';
    }
    
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    if (!formData.dates.length) {
      newErrors.dates = 'At least one date/location required';
    } else {
      formData.dates.forEach(({ date, location }, i) => {
        if (!date) newErrors.dates = `Date is required at row ${i + 1}`;
        if (!location.trim()) newErrors.dates = `Location is required at row ${i + 1}`;
      });
    }

    if (!formData.pricingTiers.length) {
      newErrors.pricingTiers = 'At least one pricing tier required';
    } else {
      formData.pricingTiers.forEach(({ name, price, capacity }, i) => {
        if (!name.trim()) newErrors.pricingTiers = `Pricing tier name is required at row ${i + 1}`;
        if (price === '' || isNaN(price) || price < 0) newErrors.pricingTiers = `Valid price is required at row ${i + 1}`;
        if (!capacity || isNaN(capacity) || capacity <= 0) newErrors.pricingTiers = `Valid capacity > 0 required at row ${i + 1}`;
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).filter(k => newErrors[k]).length === 0;
  };

 const handleSubmit = async () => {
  if (!validateForm()) {
    message.error('Please fix all errors before submitting');
    return;
  }

  setIsSubmitting(true);
  try {
    const submissionData = new FormData();
    submissionData.append('title', formData.title);
    submissionData.append('category', formData.category);
    submissionData.append('description', formData.description);
    if (formData.image?.originFileObj) {
      submissionData.append('image', formData.image.originFileObj);
    } else if (formData.image?.url) {
      const imagePath = formData.image.url.replace(`${import.meta.env.VITE_API_URL}`, '');
      submissionData.append('image', imagePath);
    }
    const formattedDates = formData.dates.map(dateObj => ({
      date: moment(dateObj.date).toISOString(),
      location: dateObj.location
    }));
    submissionData.append('dates', JSON.stringify(formattedDates));
    const formattedPricingTiers = formData.pricingTiers.map(tier => ({
      name: tier.name,
      price: parseFloat(tier.price),
      capacity: parseInt(tier.capacity, 10)
    }));
    submissionData.append('pricingTiers', JSON.stringify(formattedPricingTiers));

    await updateEvent(id, submissionData);
    message.success('Event updated successfully!');
    navigate('/manage-events');
  } catch (err) {
    console.error('Update error:', err);
    message.error(err.response?.data?.error || err.message || 'Failed to update event');
  } finally {
    setIsSubmitting(false);
  }
};

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Layout style={{ minHeight: '100vh', background: 'white' }}>
         <Button 
                type="default" 
                onClick={() => navigate(-1)}  
                style={{ marginRight: 'auto',marginLeft:'100px',marginTop:'50px' }}
                className="back-bttn"
                icon={<LeftOutlined />} 
              >
                Back
              </Button>
        <Layout.Content style={{ display:'flex',justifyContent:'center' }}>
          <div style={{ maxWidth: '700px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginTop: '0px', 
              marginBottom: '10px' 
            }}>
            
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Edit Event</h2>
            </div>

            <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
              <Form.Item label="Event Title" validateStatus={errors.title ? 'error' : ''} help={errors.title}>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Event Title"
                />
              </Form.Item>

              <Form.Item label="Category" validateStatus={errors.category ? 'error' : ''} help={errors.category}>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  placeholder="Select Category"
                >
                  {defaultCategories.map(cat => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Description" validateStatus={errors.description ? 'error' : ''} help={errors.description}>
                <TextArea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Event Description"
                />
              </Form.Item>

              <Form.Item label="Image" validateStatus={errors.image ? 'error' : ''} help={errors.image}>
                <Upload
                  name="image"
                  beforeUpload={() => false}
                  accept="image/*"
                  showUploadList={{
                    showPreviewIcon: true,
                    showRemoveIcon: true,
                    showDownloadIcon: false
                  }}
                  maxCount={1}
                  onChange={handleImageChange}
                  fileList={formData.image ? [{
                    uid: formData.image.uid || '-1',
                    name: formData.image.name || formData.image.url?.split('/').pop() || 'event-image',
                    status: 'done',
                    url: formData.image.url || formData.image,
                    originFileObj: formData.image.originFileObj
                  }] : []}
                  onRemove={() => {
                    setFormData(prev => ({ ...prev, image: null }));
                    setErrors(prev => ({ ...prev, image: '' }));
                  }}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
                <small>Leave empty to keep current image</small>
               
              </Form.Item>

              <Divider />
              <Typography.Title level={5}>Dates & Locations</Typography.Title>
              {errors.dates && (
                <div style={{ color: '#ff4d4f', marginBottom: 10 }}>
                  {errors.dates}
                </div>
              )}

              {formData.dates.map((dateObj, i) => (
                <Space key={i} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <DatePicker
                    showTime={{ format: 'HH:mm' }}
                    value={dateObj.date}
                    onChange={date => handleDateChange(i, 'date', date)}
                    className="custom-datepicker"
                  />
                  <Input
                    placeholder="Location"
                    value={dateObj.location}
                    onChange={e => handleDateChange(i, 'location', e.target.value)}
                  />
                  {formData.dates.length > 1 && (
                    <MinusCircleOutlined 
                      onClick={() => removeDateLocation(i)} 
                      style={{ color: '#ff4d4f' }} 
                    />
                  )}
                </Space>
              ))}
              <Form.Item>
                <Button 
                  type="dashed" 
                  onClick={addDateLocation} 
                  icon={<PlusOutlined />} 
                  style={{ width: '100%' }}
                >
                  Add Date & Location
                </Button>
              </Form.Item>

              <Divider />
              <Typography.Title level={5}>Pricing Tiers</Typography.Title>
              {errors.pricingTiers && (
                <div style={{ color: '#ff4d4f', marginBottom: 10 }}>
                  {errors.pricingTiers}
                </div>
              )}

              {formData.pricingTiers.map((priceObj, i) => (
                <Space key={i} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Input
                    placeholder="Name (e.g. Adult)"
                    value={priceObj.name}
                    onChange={e => handlePricingChange(i, 'name', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Price ($)"
                    value={priceObj.price}
                    onChange={e => handlePricingChange(i, 'price', e.target.value)}
                    min={0}
                    step="0.01"
                  />
                  <Input
                    type="number"
                    placeholder="Capacity"
                    value={priceObj.capacity}
                    onChange={e => handlePricingChange(i, 'capacity', e.target.value)}
                    min={1}
                  />
                  {formData.pricingTiers.length > 1 && (
                    <MinusCircleOutlined 
                      onClick={() => removePricingTier(i)} 
                      style={{ color: '#ff4d4f' }} 
                    />
                  )}
                </Space>
              ))}
              <Form.Item>
                <Button 
                  type="dashed" 
                  onClick={addPricingTier} 
                  icon={<PlusOutlined />} 
                  style={{ width: '100%' }}
                >
                  Add Pricing Tier
                </Button>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: '#021529',
                    color: '#ffd72d',
                    fontWeight: 'bold',
                    borderRadius: '20px',
                    width: '200px',
                    margin: '15px 0px 0px 0px'
                  }}
                  loading={isSubmitting}
                >
                  Update Event
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Layout.Content>
      </Layout>
      <AppFooter />
    </div>
  );
}

export default EditEvent;