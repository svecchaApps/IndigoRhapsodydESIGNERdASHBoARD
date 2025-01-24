import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Table, Input, Select, Button, Pagination, Tooltip, Modal } from "antd";
import { getOrderForTable } from "../../service/dashBoardService";
import { FaShippingFast, FaEye } from "react-icons/fa";
import OrderDetailsModal from "./orderModal";
import ShipOrderModal from "./shipOrdarModal";

const { Search } = Input;
const { Option } = Select;

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

// Styled component for status
const Status = styled.span`
  color: ${(props) =>
    props.status === "Pending"
      ? "red"
      : props.status === "Order-Shipped"
      ? "green"
      : "black"};
`;

function OrderScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShipModal, setShowShipModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrderForTable();
        setOrders(data.orders);
        setFilteredOrders(data.orders);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = orders.filter((order) =>
      order.orderId.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleShipOrder = (order) => {
    setSelectedOrder(order);
    setShowShipModal(true);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const columns = [
    {
      title: "#",
      render: (_, __, index) => (currentPage - 1) * ORDERS_PER_PAGE + index + 1,
    },
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render:(_,order)=>(
        <a onClick={() => handleViewOrder(order)}>{order.orderId}</a>
      )
      
    },
    {
      title: "Product Names",
      dataIndex: "products",
      key: "products",
      render: (products) => (
        <Tooltip title={products.map((p) => p.productName).join(", ")}>
          {products
            .map(
              (p) =>
                p.productName.slice(0, 5) +
                (p.productName.length > 5 ? "..." : "")
            )
            .join(", ")}
        </Tooltip>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address) =>
        `${address.street}, ${address.city}, ${address.state}, ${address.country}`,
    },
    {
      title: "Amount",
      dataIndex: "products",
      key: "amount",
      render: (products) =>
        `₹ ${products.reduce(
          (sum, product) => sum + product.price * product.quantity,
          0
        )}`,
    },
    {
      title: "Status",
      dataIndex: "products",
      key: "status",
      render: (products) => {
        const status = products[0]?.shipping_status || "N/A";
        return <Status status={status}>{status}</Status>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, order) => (
        <>
          <Button
            icon={<FaEye />}
            type="link"
            onClick={() => handleViewOrder(order)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<FaShippingFast />}
            type="link"
            onClick={() => handleShipOrder(order)}
          />
        </>
      ),
    },
  ];

  return (
    <Container>
      <Header>
        <h2>Orders</h2>
        <div>
          <Search
            placeholder="Search Order"
            onSearch={handleSearch}
            style={{ width: 300, marginRight: 10 }}
          />
        </div>
      </Header>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>No <strong>Orders</strong> found</p>
      ) : (
        <>
          <Table
            dataSource={filteredOrders.slice(
              (currentPage - 1) * ORDERS_PER_PAGE,
              currentPage * ORDERS_PER_PAGE
            )}
            columns={columns}
            pagination={false}
            rowKey="orderId"
          />
          <Pagination
            current={currentPage}
            total={filteredOrders.length}
            pageSize={ORDERS_PER_PAGE}
            onChange={(page) => setCurrentPage(page)}
            style={{ marginTop: 20, textAlign: "center" }}
          />
        </>
      )}

      {/* Order Details Modal */}
      <Modal
        title="Order Details"
        visible={showOrderModal}
        onCancel={() => setShowOrderModal(false)}
        footer={null}
      >
        <OrderDetailsModal selectedOrder={selectedOrder} />
      </Modal>

      {/* Ship Order Modal */}
      <Modal
        title="Ship Order"
        visible={showShipModal}
        onCancel={() => setShowShipModal(false)} // Handle modal visibility
        footer={null}
      >
        <ShipOrderModal
          order={selectedOrder}
          onClose={() => setShowShipModal(false)} // Pass the onClose function
        />
      </Modal>
    </Container>
  );
}

export default OrderScreen;
