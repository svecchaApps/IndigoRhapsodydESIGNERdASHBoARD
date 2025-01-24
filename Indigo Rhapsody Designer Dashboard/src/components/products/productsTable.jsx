import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Modal, Carousel } from "antd";
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

  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

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

  const handleImageClick = (images) => {
    setSelectedImages(images);
    setIsImageModalVisible(true);
  };

  const closeImageModal = () => {
    setIsImageModalVisible(false);
    setSelectedImages([]);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Image",
      dataIndex: "coverImage",
      key: "coverImage",
      render: (coverImage) => {
        // Handle coverImage as either array or string
        if (Array.isArray(coverImage)) {
          if (coverImage.length > 0) {
            return (
              <img
                src={coverImage[0]}
                alt="cover"
                style={{ width: "50px", height: "50px", objectFit: "cover", cursor: "pointer" }}
                onClick={() => handleImageClick(coverImage)}
              />
            );
          } else {
            return <span>No image</span>;
          }
        } else if (typeof coverImage === "string" && coverImage) {
          return (
            <img
              src={coverImage}
              alt="cover"
              style={{ width: "50px", height: "50px", objectFit: "cover", cursor: "pointer" }}
              onClick={() => handleImageClick([coverImage])}
            />
          );
        } else {
          return <span>No image</span>;
        }
      },
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
        product.variants
          .flatMap((variant) => variant.sizes.map((size) => `${size.size} - ${size.stock}`))
          .join(", "),
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

      {error && <p style={{ color: "red" }}> {error}</p>}

      <Table
        columns={columns}
        dataSource={filteredProducts}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: 10,
          onChange: (page) => setCurrentPage(page),
        }}
        rowKey={(record) => record._id}
      />

      {selectedProduct && (
        <>
          {/* View Modal */}
          <Modal
            title="View Product"
            open={isViewModalVisible}
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
              <strong>Category:</strong> {selectedProduct.category?.name || "N/A"}
            </p>
            <p>
              <strong>Sub-Category:</strong> {selectedProduct.subCategory?.name || "N/A"}
            </p>
            <p>
              <strong>Description:</strong> {selectedProduct.description || "N/A"}
            </p>

            {/* Display Cover Images */}
            <div>
              <strong>Cover Images:</strong>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
                {Array.isArray(selectedProduct.coverImage) ? (
                  selectedProduct.coverImage.length > 0 ? (
                    selectedProduct.coverImage.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Cover Image ${i}`}
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      />
                    ))
                  ) : (
                    <p>No cover images</p>
                  )
                ) : selectedProduct.coverImage ? (
                  <img
                    src={selectedProduct.coverImage}
                    alt="Cover Image"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                ) : (
                  <p>No cover image</p>
                )}
              </div>
            </div>




<div style={{ marginTop: "20px" }}>
  <strong>Variants:</strong>
  {selectedProduct.variants.map((variant, index) => (
    <div key={index} style={{ marginBottom: "20px" }}>
      <p>
        Color: {variant.color}, Sizes:{" "}
        {variant.sizes
          .map((size) => `${size.size} (Stock: ${size.stock})`)
          .join(", ")}
      </p>

      {/* Display the imageList for this variant */}
      {variant.imageList && variant.imageList.length > 0 ? (
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "10px",
            flexWrap: "wrap",
          }}
        >
          {variant.imageList.map((vImage, vIndex) => (
            <img
              key={vIndex}
              src={vImage}
              alt={`Variant ${index} Image ${vIndex}`}
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
          ))}
        </div>
      ) : (
        <p>No images for this variant</p>
      )}
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

      {/* Image Modal with Carousel */}
      <Modal
        title="Product Images"
        open={isImageModalVisible}
        onCancel={closeImageModal}
        footer={[
          <Button key="close" onClick={closeImageModal}>
            Close
          </Button>,
        ]}
      >
        {selectedImages && selectedImages.length > 0 ? (
          <Carousel>
            {selectedImages.map((imgUrl, index) => (
              <div key={index} style={{ textAlign: "center" }}>
                <img
                  src={imgUrl}
                  alt={`Selected Product ${index}`}
                  style={{ maxWidth: "100%", height: "auto", margin: "0 auto" }}
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <p>No images available</p>
        )}
      </Modal>
    </div>
  );
};

export default ProductsTable;
