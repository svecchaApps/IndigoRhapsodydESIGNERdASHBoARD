import React, { useState } from "react";
import { RecentOrderWrap } from "./productsPage.styles";
import ProductsTable from "../../components/products/productsTable";
import AddProductModal from "../../components/addProduct/addProductModal";
import styled from "styled-components";
import UploadBulkModal from "../../components/addProductBulk/addProductBulModal";

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .button-group {
    display: flex;
    gap: 10px;

    button {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;

      &.add-product {
        background-color: ${(props) => props.theme.colors.blue};

        color: #fff;
      }

      &.upload-bulk {
        background-color: ${(props) => props.theme.colors.blue};
        color: #fff;
      }
    }
  }
`;

const SearchBar = styled.input`
  width: 300px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

function ProductsPage() {
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showUploadBulkModal, setShowUploadBulkModal] = useState(false);
  // const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddProductClick = () => {
    setShowAddProductModal(true);
  };

  const closeAddProductModal = () => {
    setShowAddProductModal(false);
  };

  const handleUploadBulkClick = () => {
    setShowUploadBulkModal(true);
  };

  const closeUploadBulkModal = () => {
    setShowUploadBulkModal(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  return (
    <RecentOrderWrap className="content-area">
      <HeaderRow>
        <h5>Manage Products</h5>
        <div className="button-group">
        <SearchBar
            type="text"
            onChange={handleSearchChange}
            placeholder="Search Product"
            value={searchTerm}
          />

          <button className="add-product" onClick={handleAddProductClick}>
            Add Product +
          </button>
          <button className="upload-bulk" onClick={handleUploadBulkClick}>
            Upload Bulk +
          </button>
        </div>
      </HeaderRow>
      <ProductsTable />
      <AddProductModal
        show={showAddProductModal}
        onClose={closeAddProductModal}
      />
      <UploadBulkModal
        show={showUploadBulkModal}
        onClose={closeUploadBulkModal}
      />
    </RecentOrderWrap>
  );
}

export default ProductsPage;
