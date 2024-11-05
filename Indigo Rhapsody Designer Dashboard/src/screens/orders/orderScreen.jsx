import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getOrderForTable } from "../../service/dashBoardService";
import { FaShippingFast, FaEye } from "react-icons/fa";
import OrderDetailsModal from "./orderModal";
import ShipOrderModal from "./shipOrdarModal";

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchBar = styled.input`
  width: 300px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Filter = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th,
  td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f7f8fa;
  }
`;

const Status = styled.span`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  background-color: ${(props) =>
    props.status === "Complete" || props.status === "Order-Shipped"
      ? "#d4edda"
      : props.status === "Pending"
      ? "#fff3cd"
      : "#f8d7da"};
  color: ${(props) =>
    props.status === "Complete" || props.status === "Order-Shipped"
      ? "#155724"
      : props.status === "Pending"
      ? "#856404"
      : "#721c24"};
`;

const ActionButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  margin-right: 10px;
  font-size: 20px;

  &:hover {
    color: #007bff;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  background-color: #fff;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 5000;
  max-width: 300px;
  display: ${(props) => (props.show ? "block" : "none")};
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  max-width: 600px;
  width: 90%;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  float: right;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;

  button {
    margin: 0 5px;
    padding: 5px 10px;
    border: none;
    background-color: #007bff;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
`;

const ModalOverlay = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999; /* Increase the z-index to ensure it overlays other content */
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  width: 80%;
  height: 80%;
  max-width: 600px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 10000; /* Ensure this is higher than ModalOverlay */
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 20px;

  h3 {
    margin: 0;
  }
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
`;

const SectionContent = styled.div`
  background-color: #f7f8fa;
  padding: 15px;
  border-radius: 5px;
`;

const DetailsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  p {
    margin: 0;
  }

  strong {
    margin-right: 5px;
  }
`;
function OrderScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShipModal, setShowShipModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [tooltip, setTooltip] = useState({
    show: false,
    content: "",
    position: { x: 0, y: 0 },
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const ORDERS_PER_PAGE = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrderForTable();
        setOrders(data.orders);
        setFilteredOrders(data.orders); // Assuming `data.orders` contains the orders array
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const filtered = orders.filter((order) =>
        order.orderId.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }

    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleMouseEnter = (e, fullProductNames) => {
    setTooltip({
      show: true,
      content: fullProductNames,
      position: { x: e.clientX, y: e.clientY },
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, content: "", position: { x: 0, y: 0 } });
  };

  const handleShipOrder = (order) => {
    setSelectedOrder(order);
    setShowShipModal(true);
  };

  const closeShipModal = () => {
    setShowShipModal(false);
    setSelectedOrder(null);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  return (
    <Container>
      <Header>
        <h2>Orders</h2>
        <div>
          <SearchBar
            type="text"
            onChange={handleSearchChange}
            placeholder="Search Product"
          />
          <Filter>
            <option>Mar – April, 2021</option>
            {/* Add more options as needed */}
          </Filter>
        </div>
      </Header>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Product Names</th>
              <th>Address</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => {
              const productNames = order.products
                .map((product) => product.productName)
                .join(", ");
              const truncatedProductNames = order.products
                .map(
                  (product) =>
                    product.productName.slice(0, 5) +
                    (product.productName.length > 5 ? "..." : "")
                )
                .join(", ");
              const totalAmount = order.products.reduce(
                (sum, product) => sum + product.price * product.quantity,
                0
              );
              const combinedShippingStatus = order.products
                .map((product) => product.shipping_status || "N/A")
                .join(", ");

              return (
                <tr key={order.orderId}>
                  <td>{index + 1}</td>
                  <td>{order.orderId}</td>
                  <td
                    onMouseEnter={(e) => handleMouseEnter(e, productNames)}
                    onMouseLeave={handleMouseLeave}
                    style={{ cursor: "pointer" }}
                  >
                    {truncatedProductNames}
                  </td>
                  <td>
                    {`${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}`}
                  </td>
                  <td>₹ {totalAmount}</td>
                  <td>
                    <Status status={combinedShippingStatus}>
                      {combinedShippingStatus}
                    </Status>
                  </td>
                  <td>
                    <ActionButton
                      title="View Order"
                      onClick={() => handleViewOrder(order)}
                    >
                      <FaEye />
                    </ActionButton>
                    <ActionButton
                      title="Ship Order"
                      onClick={() => handleShipOrder(order)}
                    >
                      <FaShippingFast />
                    </ActionButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
      {showModal && (
        <>
          <ModalOverlay show={showModal} onClick={closeModal} />
          <ModalContainer show={showModal}>
            <OrderDetailsModal
              show={showModal}
              onClose={closeModal}
              selectedOrder={selectedOrder}
            />
          </ModalContainer>
        </>
      )}
      {showShipModal && (
        <>
          <ModalOverlay show={showShipModal} onClick={closeShipModal} />
          <ModalContainer show={showShipModal}>
            <ShipOrderModal
              show={showShipModal}
              onClose={closeShipModal}
              order={selectedOrder}
            />
          </ModalContainer>
        </>
      )}

      {tooltip.show && (
        <Tooltip
          style={{
            top: `${tooltip.position.y + 10}px`,
            left: `${tooltip.position.x + 10}px`,
          }}
        >
          {tooltip.content}
        </Tooltip>
      )}

      <Pagination>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </Pagination>
    </Container>
  );
}

export default OrderScreen;
