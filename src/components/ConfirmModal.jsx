import React from 'react';
import { Modal } from 'antd';

function ConfirmModal({
  visible,
  onConfirm,
  onCancel,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  centered = true
}) {
  return (
    <Modal
  title={title}
  open={visible}
  onOk={onConfirm}
  onCancel={onCancel}
  okText={confirmText}
  cancelText={cancelText}
  confirmLoading={loading}
  centered={centered}
  okButtonProps={{
    style: {
      backgroundColor: '#021529', 
      borderColor: '#021529',
      color: '#ffd72d',           
      fontWeight: 'bold',
    },
  }}
  cancelButtonProps={{
    style: {
      color: '#021529',
      borderColor: '#021529',
      fontWeight: 'bold',
    },
  }}
>
  {children}
</Modal>
  );
}

export default ConfirmModal;