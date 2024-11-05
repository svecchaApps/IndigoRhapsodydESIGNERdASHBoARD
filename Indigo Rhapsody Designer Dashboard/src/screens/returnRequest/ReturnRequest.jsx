import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getReturnRequest } from "../../service/returnRequest";

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
`;

const ReturnRequest = () => {
  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReturnRequests = async () => {
      try {
        const data = await getReturnRequest();
        setReturnRequests(data.returnRequests || []); // Use 'returnRequests' based on the response structure
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchReturnRequests();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  return (
    <TableContainer>
      <h2>Return Requests</h2>
      <StyledTable>
        <thead>
          <tr>
            <th>Return ID</th>
            <th>Order ID</th>
            <th>Product Name</th>
            <th>Status</th>

            <th>Created Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {returnRequests.map((request, index) => (
            <tr key={index}>
              <td>{request.products.returnId}</td>
              <td>{request.orderId}</td>
              <td>{request.products.productName}</td>

              <td>{request.products.returnStatus}</td>
              <td>{new Date(request.createdDate).toLocaleDateString()}</td>
              <td>
                <button>Process</button>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default ReturnRequest;
