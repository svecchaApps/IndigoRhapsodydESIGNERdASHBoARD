import React, { useState } from "react";
import styled from "styled-components";
import { createShippingOrder } from "../../service/shippinService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Styled components (as provided in your original code)
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 20px;

  h3 {
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.colors.blue};
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

const ProductList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ProductItem = styled.li`
  margin-bottom: 10px;
`;

const ShipOrderModal = ({ show, onClose, order }) => {
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    length: "",
    breadth: "",
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  if (!order) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      orderId: order.orderId,
      height: formData.height,
      weight: formData.weight,
      length: formData.length,
      breadth: formData.breadth,
      pickup_Location: "New",
    };

    // console.log("Request body being sent to API:", requestBody);

    try {
      // Replace this with your actual API function call
      const result = await createShippingOrder(requestBody);
      setResponse(result);
      setError(null);
      toast.success("Product created successfully!");
      // alert("Shipping order created successfully");
      onClose();
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to create product: ${error.message}`);
      // alert("Failed to create shipping order");
    }
  };

  return (
    <>
      <ModalHeader>
        <h3>Ship Order</h3>
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </ModalHeader>
      <Form onSubmit={handleFormSubmit}>
        <ProductList>
          {order.products.map((product, index) => (
            <ProductItem key={index}>
              {product.productName} - Quantity: {product.quantity}
            </ProductItem>
          ))}
        </ProductList>
        <Input
          type="number"
          name="height"
          placeholder="Height"
          value={formData.height}
          onChange={handleInputChange}
        />
        <Input
          type="number"
          name="weight"
          placeholder="Weight"
          value={formData.weight}
          onChange={handleInputChange}
        />
        <Input
          type="number"
          name="length"
          placeholder="Length"
          value={formData.length}
          onChange={handleInputChange}
        />
        <Input
          type="number"
          name="breadth"
          placeholder="Breadth"
          value={formData.breadth}
          onChange={handleInputChange}
        />
        <Button type="submit">Ship Order</Button>
      </Form>
      {response && (
        <div>
          <h4>Response:</h4>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div style={{ color: "red" }}>
          <h4>Error:</h4>
          <p>{error}</p>
        </div>
      )}
    </>
  );
};

export default ShipOrderModal;
