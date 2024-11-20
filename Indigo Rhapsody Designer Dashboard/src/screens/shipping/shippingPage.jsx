import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, message } from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import styled from "styled-components";
import {
  getShippingDetails,
  createInvoice,
} from "../../service/shippinService";

const TableContainer = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
  }

  .search-bar {
    max-width: 300px;
    width: 100%;
  }
`;

const ShippingPage = () => {
  const [shippings, setShippings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchShippings = async () => {
      try {
        const data = await getShippingDetails();
        setShippings(data.shippings);
        setFilteredData(data.shippings); // Initialize filtered data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchShippings();
  }, []);

  const handleDownloadInvoice = async (shipmentId) => {
    try {
      const invoiceData = await createInvoice(shipmentId);
      const invoiceUrl = invoiceData.label_url;

      const link = document.createElement("a");
      link.href = invoiceUrl;
      link.download = `Invoice-${shipmentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success("Invoice downloaded successfully!");
    } catch (err) {
      message.error(`Failed to download invoice: ${err.message}`);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = shippings.filter(
      (shipping) =>
        shipping.order_id.toLowerCase().includes(value.toLowerCase()) ||
        shipping.shipmentId.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
    },
    {
      title: "Shipment ID",
      dataIndex: "shipmentId",
      key: "shipmentId",
    },
    {
      title: "Order Date",
      dataIndex: "order_date",
      key: "order_date",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadInvoice(record.shipmentId)}
          >
            Download Invoice
          </Button>
          <Button type="danger">Delete</Button>
        </Space>
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
    <TableContainer>
      <Header>
        <h2>Shipped Orders</h2>
        <Input
          className="search-bar"
          placeholder="Search by Order ID or Shipment ID"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          prefix={<SearchOutlined />}
        />
      </Header>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(record) => record.shipmentId}
        pagination={{ pageSize: 10 }}
      />
    </TableContainer>
  );
};

export default ShippingPage;
