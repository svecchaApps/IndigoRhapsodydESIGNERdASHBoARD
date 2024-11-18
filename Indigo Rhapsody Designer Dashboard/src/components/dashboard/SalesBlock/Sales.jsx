import React, { useEffect, useState } from "react";
import {
  dashBoardDesigner,
  dashBoardDesignerSales,
  dashBoardDesignerProducts,
} from "../../../service/dashBoardService"; // Adjust the path accordingly
import { BlockContentWrap, BlockTitle } from "../../../styles/global/default";
import { Icons } from "../../../assets/icons";
import { SalesBlockWrap } from "./Sales.style";

const Sales = () => {
  const [ordersData, setOrdersData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [productsData, setProductsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await dashBoardDesignerProducts();

        setProductsData(productsResponse);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    const fetchOrders = async () => {
      try {
        const ordersResponse = await dashBoardDesigner();
        setOrdersData(ordersResponse);
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };

    const fetchSales = async () => {
      try {
        const salesResponse = await dashBoardDesignerSales();
        setSalesData(salesResponse);
      } catch (error) {
        console.error("Error fetching sales:", error.message);
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all data independently
        await Promise.all([fetchProducts(), fetchOrders(), fetchSales()]);
      } catch (err) {
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <SalesBlockWrap>
      <div className="block-head">
        <div className="block-head-l">
          <BlockTitle className="block-title">
            <h3>Today&apos;s Sales</h3>
          </BlockTitle>
          <p className="Sales Summary">{error ? `Error: ${error}` : ""}</p>
        </div>
        <div className="block-head-r">
          <button type="button" className="export-btn">
            <img src={Icons.ExportDark} alt="" />
            <span className="text">Export</span>
          </button>
        </div>
      </div>
      <BlockContentWrap>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="cards">
            <div className="card-item card-misty-rose">
              <div className="card-item-icon">
                <img src={Icons.CardOrder} alt="Orders Icon" />
              </div>
              <div className="card-item-value">
                {ordersData ? ordersData.totalOrders : "Error fetching orders"}
              </div>
              <p className="card-item-text text">Total Orders</p>
              <span className="card-item-sm-text">orders</span>
            </div>
            <div className="card-item card-latte">
              <div className="card-item-icon">
                <img src={Icons.CardSales} alt="Sales Icon" />
              </div>
              <div className="card-item-value">
                {salesData
                  ? `₹ ${salesData.totalSalesAmount}`
                  : "Error fetching sales"}
              </div>
              <p className="card-item-text text">Total Sales</p>
              <span className="card-item-sm-text">sales</span>
            </div>
            <div className="card-item card-coffee">
              <div className="card-item-icon">
                <img src={Icons.CardProduct} alt="Products Icon" />
              </div>
              <div className="card-item-value">
                {productsData
                  ? productsData.totalProducts
                  : "Error fetching products"}
              </div>
              <p className="card-item-text text">Total Products</p>
              <span className="card-item-sm-text">products</span>
            </div>
          </div>
        )}
      </BlockContentWrap>
    </SalesBlockWrap>
  );
};

export default Sales;
