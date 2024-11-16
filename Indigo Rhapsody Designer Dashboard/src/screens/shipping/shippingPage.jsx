import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getShippingDetails,
  createInvoice,
} from "../../service/shippinService";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const TableContainer = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;

  th,
  td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f4f4f4;
    font-weight: 600;
  }

  tr:hover {
    background-color: #f1f1f1;
  }

  .action-icons {
    display: flex;
    gap: 10px;
    cursor: pointer;
  }
`;
const ShippingPage = () => {
  const [shippings, setShippings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShippings = async () => {
      try {
        const data = await getShippingDetails();
        setShippings(data.shippings);
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

      toast.success("Invoice downloaded successfully!");
    } catch (err) {
      toast.error(`Failed to download invoice: ${err.message}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  return (
    <TableContainer>
      <ToastContainer />
      <h2>Shipped Orders</h2>
      <StyledTable>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Shipment ID</th>
            <th>Order Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {shippings.map((shipping, index) => (
            <tr key={index}>
              <td>{shipping.order_id}</td>
              <td>{shipping.shipmentId}</td>
              <td>{new Date(shipping.order_date).toLocaleDateString()}</td>
              <td>
                <div className="action-icons">
                  <span
                    role="img"
                    aria-label="download"
                    onClick={() => handleDownloadInvoice(shipping.shipmentId)}
                  >
                    📥
                  </span>
                  <span role="img" aria-label="delete">
                    ❌
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default ShippingPage;
