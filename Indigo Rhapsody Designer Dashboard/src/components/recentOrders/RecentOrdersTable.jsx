import React, { useEffect, useState } from "react";
import { Table, message, Space, Image, Tag } from "antd";
import { getOrderForTable } from "../../service/dashBoardService";
import styled from "styled-components"; // If using styled-components

const RecentOrderWrap = styled.div`
  padding: 20px;

  h2 {
    margin-bottom: 20px;
  }

  /* Additional custom styles if needed */
`;

function RecentOrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrderForTable();
        setOrders(data.orders);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      sorter: (a, b) => a.orderId.localeCompare(b.orderId),
      render: (text) => <a href={`/orders/${text}`}>{text}</a>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => `₹ ${amount}`,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      filters: [
        { text: "Credit Card", value: "Credit Card" },
        { text: "PayPal", value: "PayPal" },
        { text: "Cash on Delivery", value: "Cash on Delivery" },
        // Add more payment methods as needed
      ],
      onFilter: (value, record) => record.paymentMethod === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Completed", value: "Completed" },
        { text: "Cancelled", value: "Cancelled" },
        // Add more statuses as needed
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color;
        switch (status.toLowerCase()) {
          case "completed":
            color = "green";
            break;
          case "pending":
            color = "orange";
            break;
          case "cancelled":
            color = "red";
            break;
          default:
            color = "blue";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (products) => (
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          {products.map((product, idx) => (
            <li key={idx}>
              {product.productName} - {product.quantity} pcs (Color:{" "}
              {product.color}, Size: {product.size})
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      sorter: (a, b) => a.city.localeCompare(b.city),
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      sorter: (a, b) => a.state.localeCompare(b.state),
    },
  ];

  const data = orders.map((order) => ({
    key: order.orderId, // Assuming orderId is unique
    ...order,
  }));

  return (
    <RecentOrderWrap>
      <h2>Recent Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
          bordered
          rowClassName={(record) =>
            `order-status-${record.status.toLowerCase().replace(" ", "-")}`
          }
        />
      )}
    </RecentOrderWrap>
  );
}

export default RecentOrdersTable;
