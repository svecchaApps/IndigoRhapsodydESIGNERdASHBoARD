import React from "react";
import styled from "styled-components";

// Styled components for the modal
// const ModalOverlay = styled.div`
//   display: ${(props) => (props.show ? "block" : "none")};
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: rgba(0, 0, 0, 0.5);
//   z-index: 999;
// `;

// const ModalContainer = styled.div`
//   display: ${(props) => (props.show ? "block" : "none")};
//   position: fixed;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   background-color: #fff;
//   border-radius: 10px;
//   padding: 20px;
//   width: 80%;
//   max-width: 1000px;
//   box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
//   overflow-y: auto;
// `;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
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

function OrderDetailsModal({ show, onClose, selectedOrder }) {
  if (!selectedOrder) return null;

  return (
    <>
      {/* <CloseButton onClick={onClose}>&times;</CloseButton> */}
      <ModalHeader>
        <span>Status: {selectedOrder.status}</span>
      </ModalHeader>

      <Section>
        <SectionTitle>Order ID</SectionTitle>
        <SectionContent>
          <p>{selectedOrder.orderId}</p>
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Customer Details</SectionTitle>
        <SectionContent>
          <DetailsRow>
            <p>
              <strong>Name:</strong> {selectedOrder.userId.displayName || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder.userId.email || "N/A"}
            </p>
          </DetailsRow>
          <DetailsRow>
            <p>
              <strong>Phone:</strong>{" "}
              {selectedOrder.userId.phoneNumber || "N/A"}
            </p>
          </DetailsRow>
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Products</SectionTitle>
        <SectionContent>
          {selectedOrder.products.map((product, index) => (
            <div key={index}>
              <p>
                <strong>{product.productName}</strong> - Quantity:{" "}
                {product.quantity}, Price:₹ {product.price} (Size:{" "}
                {product.size}, Color: {product.color})
              </p>
            </div>
          ))}
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Shipping Address</SectionTitle>
        <SectionContent>
          <p>
            {`${selectedOrder.address.street}, ${selectedOrder.address.city}, ${selectedOrder.address.state}, ${selectedOrder.address.country}`}
          </p>
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Order Summary</SectionTitle>
        <SectionContent>
          <p>
            <strong>Total Amount:</strong> ₹
            {selectedOrder.products.reduce(
              (sum, product) => sum + product.price * product.quantity,
              0
            )}{" "}
          </p>
          <p>
            <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
          </p>
        </SectionContent>
      </Section>
    </>
  );
}

export default OrderDetailsModal;
