import React, { useState } from "react";
import { RecentOrderWrap } from "./productsPage.styles";
import ProductsTable from "../../components/products/productsTable";
import AddProductModal from "../../components/addProduct/addProductModal";
import AddSubCategoryModal from "./addSubCategory"; // Import the modal
import styled from "styled-components";
import UploadBulkModal from "../../components/addProductBulk/addProductBulModal";
import EditVariantModal from "../../components/addProductBulk/editProductBulkModal"; // Import the EditVariantModal
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

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
  const [showAddSubCategoryModal, setShowAddSubCategoryModal] = useState(false);
  const [showUploadBulkModal, setShowUploadBulkModal] = useState(false);
  const [showEditVariantModal, setShowEditVariantModal] = useState(false); // State for EditVariantModal
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddProductClick = () => {
    setShowAddProductModal(true);
  };

  const closeAddProductModal = () => {
    setShowAddProductModal(false);
  };

  const handleAddSubCategoryClick = () => {
    setShowAddSubCategoryModal(true);
  };

  const closeAddSubCategoryModal = () => {
    setShowAddSubCategoryModal(false);
  };

  const handleUploadBulkClick = () => {
    setShowUploadBulkModal(true);
  };

  const closeUploadBulkModal = () => {
    setShowUploadBulkModal(false);
  };

  // Handler for "Edit Bulk +" button
  const handleEditBulkClick = () => {
    setShowEditVariantModal(true);
  };

  const closeEditVariantModal = () => {
    setShowEditVariantModal(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <RecentOrderWrap className="content-area">
      <ToastContainer />
      <HeaderRow>
        <h2>Manage Products</h2>
        <div className="button-group">
          <button className="add-product" onClick={handleAddProductClick}>
            Add Product +
          </button>
          <button className="add-product" onClick={handleEditBulkClick}>
            Edit Bulk +
          </button>
          <button className="add-product" onClick={handleAddSubCategoryClick}>
            Add Sub-Category +
          </button>
          <button className="upload-bulk" onClick={handleUploadBulkClick}>
            Upload Bulk +
          </button>
        </div>
      </HeaderRow>
      <ProductsTable searchTerm={searchTerm} />
      <AddProductModal
        show={showAddProductModal}
        onClose={closeAddProductModal}
      />
      <AddSubCategoryModal
        visible={showAddSubCategoryModal}
        onClose={closeAddSubCategoryModal}
      />
      <UploadBulkModal
        show={showUploadBulkModal}
        onClose={closeUploadBulkModal}
      />
      <EditVariantModal
        show={showEditVariantModal}
        onClose={closeEditVariantModal}
      />
    </RecentOrderWrap>
  );
}

export default ProductsPage;
