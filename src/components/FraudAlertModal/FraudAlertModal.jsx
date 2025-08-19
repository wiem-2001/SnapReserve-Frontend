import React from 'react';
import { Modal, Typography } from 'antd';
import '../ConfirmModal/ConfirmModal.css';
import { WarningOutlined } from '@ant-design/icons';

const { Text } = Typography;

const FraudAlertModal = ({ visible, onClose }) => {
  return (
    <Modal
      title="Payment Blocked"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      className="custom-confirm-modal"
    >
       <div style={{ textAlign: 'center' }}>
      <WarningOutlined style={{ fontSize: '48px', color: 'red', marginBottom: 16 }} />
      <br />
      <Text  style={{ fontSize: '16px', fontWeight: 'bold' }}>
        This transaction was blocked due to suspicious activity. Your account remains active, but this payment cannot be processed at this time.
      </Text>
       <Text  style={{ fontSize: '16px', fontWeight: 'bold' }}>
        If you believe this was a mistake, please ignore this and try again.
      </Text>
       </div>
      
    </Modal>
  );
};

export default FraudAlertModal;
