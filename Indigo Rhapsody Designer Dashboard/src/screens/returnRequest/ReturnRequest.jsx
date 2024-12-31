import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  message,
  Modal,
  Descriptions,
  Image,
  Typography,
} from "antd";
import {
  getReturnRequest,
  CreateReturnRequest,
  DeclineReturnRequest,
} from "../../service/returnRequest";
import "./returnRequest.css";

const { Title, Text } = Typography;

const ReturnRequest = () => {
  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchReturnRequests = async () => {
      try {
        const data = await getReturnRequest();
        setReturnRequests(data.returnRequests || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchReturnRequests();
  }, []);

  const handleProcessReturn = async (returnId) => {
    try {
      await CreateReturnRequest(returnId);
      message.success("Return request processed successfully");
      // Refresh returnRequests to reflect the updated status
    } catch (error) {
      message.error(`Failed to process return request: ${error.message}`);
    }
  };

  const handleRejectReturn = async (returnId) => {
    try {
      await DeclineReturnRequest(returnId);
      message.success("Return request rejected successfully");
      // Refresh returnRequests to reflect the updated status
    } catch (error) {
      message.error(`Failed to process return request: ${error.message}`);
    }
  };

  const showModal = (record) => {
    setSelectedRequest(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRequest(null);
  };

  const columns = [
    {
      title: "Return ID",
      dataIndex: ["products", "returnId"],
      key: "returnId",
      render: (returnId, record) => (
        <a onClick={() => showModal(record)}>{returnId}</a>
      ),
    },
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Product Name",
      dataIndex: ["products", "productName"],
      key: "productName",
    },
    {
      title: "Status",
      dataIndex: ["products", "returnStatus"],
      key: "returnStatus",
      render: (status) => (
        <span
          style={{
            backgroundColor:
              status === "Return Processed" ? "#d4edda" : "#fff3cd",
            color: status === "Return Processed" ? "#155724" : "#856404",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (createdDate) => new Date(createdDate).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            className="button"
            type="primary"
            onClick={() => handleProcessReturn(record.products.returnId)}
            disabled={record.products.returnStatus === "Return Processed"}
          >
            Process
          </Button>
          <Button
            className="button"
            // type="primary"
            onClick={() => handleRejectReturn(record.products.returnId)}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: 20, backgroundColor: "#f9f9f9" }}>
      <h2>Return Requests</h2>
      <Table
        dataSource={returnRequests}
        columns={columns}
        rowKey={(record) => record.products.returnId}
        pagination={{ pageSize: 10 }}
      />
      {selectedRequest && (
        <Modal
          title={
            <div>
              <Title level={4} style={{ marginBottom: 0 }}>
                Return Request Details
              </Title>
              <Text type="secondary">Review the details carefully</Text>
            </div>
          }
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="close" onClick={handleModalClose}>
              Close
            </Button>,
          ]}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Return ID">
                {selectedRequest.products.returnId}
              </Descriptions.Item>
              <Descriptions.Item label="Order ID">
                {selectedRequest.orderId}
              </Descriptions.Item>
              <Descriptions.Item label="Product Name">
                {selectedRequest.products.productName}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {selectedRequest.products.returnStatus}
              </Descriptions.Item>
              <Descriptions.Item label="Reason">
                {selectedRequest.products.reason || "Not provided"}
              </Descriptions.Item>
              <Descriptions.Item label="Created Date">
                {new Date(selectedRequest.createdDate).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>
            {selectedRequest.products.imageUrl && (
              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <Title level={5}>Product Image</Title>
                <Image
                  src={selectedRequest.products.imageUrl}
                  alt="Product"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ReturnRequest;
