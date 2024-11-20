import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Modal } from "antd";
import { SearchOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { getProductsBydesigner } from "../../service/productsService";
import EditProductModal from "../../components/editProductsa/editProductsModal";

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsBydesigner();
        setProducts(data.products);
        setFilteredProducts(data.products);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const filtered = products.filter((product) =>
        product.productName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setIsViewModalVisible(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  const closeViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedProduct(null);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Cover Photo",
      dataIndex: "coverImage",
      key: "coverImage",
      render: (coverImage) => (
        <img
          src={coverImage}
          alt="Cover"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `₹${price}`,
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      render: (category) => category || "N/A",
    },
    {
      title: "Sub-Category",
      dataIndex: ["subCategory", "name"],
      key: "subCategory",
      render: (subCategory) => subCategory || "N/A",
    },
    {
      title: "Inventory",
      key: "inventory",
      render: (_, product) =>
        product.variants.flatMap((variant) =>
          variant.sizes.map(
            (size, index) => `${size.size} - ${size.stock}`
          )
        ).join(", "),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, product) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleView(product)}
          >
            View
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEdit(product)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 20,
        }}
      >
        <Input
          placeholder="Search by product name"
          value={searchTerm}
          onChange={handleSearch}
          prefix={<SearchOutlined />}
          style={{ width: "300px" }}
        />
      </div>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <Table
        columns={columns}
        dataSource={filteredProducts}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: 10,
          onChange: (page) => setCurrentPage(page),
        }}
        rowKey={(record) => record._id} // Replace _id with the appropriate unique key
      />

      {selectedProduct && (
        <>
          {/* View Modal */}
          <Modal
            title="View Product"
            visible={isViewModalVisible}
            onCancel={closeViewModal}
            footer={[
              <Button key="close" onClick={closeViewModal}>
                Close
              </Button>,
            ]}
          >
            <p>
              <strong>Name:</strong> {selectedProduct.productName}
            </p>
            <p>
              <strong>Price:</strong> ₹{selectedProduct.price}
            </p>
            <p>
              <strong>Category:</strong>{" "}
              {selectedProduct.category?.name || "N/A"}
            </p>
            <p>
              <strong>Sub-Category:</strong>{" "}
              {selectedProduct.subCategory?.name || "N/A"}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {selectedProduct.description || "N/A"}
            </p>
            <div>
              <strong>Variants:</strong>
              {selectedProduct.variants.map((variant, index) => (
                <div key={index}>
                  <p>
                    Color: {variant.color}, Sizes:{" "}
                    {variant.sizes
                      .map((size) => `${size.size} (Stock: ${size.stock})`)
                      .join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </Modal>

          {/* Edit Modal */}
          <EditProductModal
            show={showEditModal}
            onClose={closeEditModal}
            product={selectedProduct}
          />
        </>
      )}
    </div>
  );
};

export default ProductsTable;
