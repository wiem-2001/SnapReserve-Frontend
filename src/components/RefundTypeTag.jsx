import React from "react";
import { Tag } from "antd";

const RefundTypeTag = ({ refundType, refundPercentage }) => {
  if (!refundType) return null;

  let text;
  switch (refundType) {
    case "NO_REFUND":
      text = "No Refund";
      break;
    case "FULL_REFUND":
      text = "Full Refund Available";
      break;
    case "PARTIAL_REFUND":
      text = `Partial Refund (${refundPercentage}%)`;
      break;
    default:
      return null;
  }

  return <Tag color="blue">{text}</Tag>;
};

export default RefundTypeTag;
