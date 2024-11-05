// import React from "react";
import React, { useEffect, useState } from "react";
import { RecentOrderWrap } from "./RecentOrderTable.styles"; // Adjust the path based on your file structure
import { getOrderForTable } from "../../service/dashBoardService";
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

  return (
    <RecentOrderWrap>
      <h2>Recent Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Products</th>
              <th>City</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.orderId}</td>
                <td>₹ {order.amount}</td>
                <td>{order.paymentMethod}</td>
                <td
                  className={`status ${order.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {order.status}
                </td>
                <td>
                  <ul>
                    {order.products.map((product, idx) => (
                      <li key={idx}>
                        {product.productName} - {product.quantity} pcs (Color:{" "}
                        {product.color}, Size: {product.size})
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{order.city}</td>
                <td>{order.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </RecentOrderWrap>
  );
}

export default RecentOrdersTable;
