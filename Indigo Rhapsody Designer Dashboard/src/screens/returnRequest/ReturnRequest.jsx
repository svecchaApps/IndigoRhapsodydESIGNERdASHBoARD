import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import {
  getReturnRequest,
  CreateReturnRequest,
} from "../../service/returnRequest";

const ReturnRequest = () => {
  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      // Optionally, refresh returnRequests to reflect the updated status
      fetchReturnRequests();
    } catch (error) {
      message.error(`Failed to process return request: ${error.message}`);
    }
  };

  const columns = [
    {
      title: "Return ID",
      dataIndex: ["products", "returnId"],
      key: "returnId",
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
        <Button
          type="primary"
          onClick={() => handleProcessReturn(record.products.returnId)}
        >
          Process
        </Button>
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
    </div>
  );
};

export default ReturnRequest;
