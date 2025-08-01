import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import './ConfirmModal/ConfirmModal.css';

function SuspiciousActivityModal({ visible, onClose }) {
  const navigate = useNavigate();

  const handleConfirm = () => {
    onClose();
    navigate('/support');
  };

  return (
    <Modal
       visible={visible}
        onOk={handleConfirm}     // Correct event handler for OK button
        onCancel={onClose}
        title="Suspicious Activity Detected"
        okText="Got it"          // Correct text for confirm button
        centered
    >
      <p>
        We've detected unusual activity related to your recent ticket purchase attempt. 
        For your security, the transaction has been blocked temporarily.
      </p>
      <p>
        If you believe this is a mistake, please contact our support team. 
        We’ll help you verify your identity and continue with your purchase.
      </p>
    </Modal>
  );
}

export default SuspiciousActivityModal;
