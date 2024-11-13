import React, { useEffect, useState } from "react";
import { getProductsBydesigner } from "../../service/productsService";
import { RecentOrderWrap } from "../recentOrders/RecentOrderTable.styles";
import styled from "styled-components";
import EditProductModal from "../../components/editProductsa/editProductsModal";

const PRODUCTS_PER_PAGE = 10;

const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  align-items: center;

  button {
    margin: 0 5px;
    padding: 10px 15px;
    border: none;
    background-color: ${(props) => props.theme.colors.blue};
    color: #fff;
    cursor: pointer;
    border-radius: 5px;

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
`;

const Dialog = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  max-width: 800px;
  width: 100%;
  overflow-y: auto;
  max-height: 90vh;
`;

const Overlay = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const FormSection = styled.div`
  margin-bottom: 20px;

  h4 {
    margin-bottom: 10px;
    font-size: 18px;
    color: #333;
  }

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  input,
  textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 6px;
    border: 1px solid #ccc;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);

    &:focus {
      outline: none;
      border-color: ${(props) => props.theme.colors.blue};
    }
  }

  textarea {
    resize: vertical;
  }

  .images-container {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;

    img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 5px;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &.cancel {
      background-color: #f0f0f0;
      color: #333;
    }

    &.continue {
      background-color: ${(props) => props.theme.colors.blue};
      color: #fff;
    }
  }
`;

function ProductsTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // const [filteredProducts, setFilteredProducts] = useState([]);

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
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setSelectedProduct(null);
    setShowEditModal(false);
  };

  const handleViewEdit = (product) => {
    setSelectedProduct(product);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setSelectedProduct(null);
    setShowDialog(false);
  };

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page on a new search
  };

  return (
    <RecentOrderWrap>
      {/* <h2>Products</h2> */}
      {/* <input
        type="text"
        placeholder="Search by product name"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          marginBottom: "20px",
          padding: "10px",
          width: "100%",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      /> */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Cover Photo</th>
              <th>Photos</th>
              <th>Price</th>
              <th>Sub-Category</th>
              <th>Category</th>
              <th>Colors</th>
              <th>Sizes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product, index) => (
              <tr key={index}>
                <td>{product.productName}</td>
                <td>
                  <img
                    src={product.coverImage}
                    alt={product.productName}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>
                  {product.variants.map((variant, vIndex) => (
                    <img
                      key={vIndex}
                      src={variant.imageList[0]}
                      alt={variant.color}
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                        marginRight: "5px",
                      }}
                    />
                  ))}
                </td>
                <td>₹{product.price}</td>
                <td>{product.subCategory?.name || "N/A"}</td>
                <td>{product.category?.name || "N/A"}</td>
                <td>
                  {product.variants.map((variant, vIndex) => (
                    <div
                      key={vIndex}
                      style={{
                        display: "inline-block",
                        width: "15px",
                        height: "15px",
                        backgroundColor: variant.color,
                        marginRight: "5px",
                        borderRadius: "50%",
                      }}
                    ></div>
                  ))}
                </td>
                <td>
                  <ul>
                    {product.variants.flatMap((variant) =>
                      variant.sizes.map((size, sIndex) => (
                        <li key={sIndex}>{size.size}</li>
                      ))
                    )}
                  </ul>
                </td>
                <td>
                  <button
                    style={{ marginRight: "5px" }}
                    onClick={() => handleViewEdit(product)}
                  >
                    View
                  </button>
                  <button onClick={() => handleEdit(product)}>Edit</button>
                </td>
              </tr>
            ))}
            <PaginationControls>
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </PaginationControls>
          </tbody>
        </table>
      )}

      {/* Dialog Component */}
      <Overlay show={showDialog} onClick={closeDialog} />
      <Dialog show={showDialog}>
        {selectedProduct && (
          <form>
            <FormSection>
              <h4>Product Information</h4>
              <div className="images-container">
                {selectedProduct.variants.flatMap((variant) =>
                  variant.imageList.map((image, index) => (
                    <img key={index} src={image} alt="Product" />
                  ))
                )}
              </div>
              <label htmlFor="productName">Name</label>
              <input
                type="text"
                id="productName"
                defaultValue={selectedProduct.productName}
                readOnly
              />
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="3"
                defaultValue={selectedProduct.description}
                readOnly
              />
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                defaultValue={selectedProduct.category.name}
                readOnly
              />
              <label htmlFor="subcategory">Subcategory</label>
              <input
                type="text"
                id="subcategory"
                defaultValue={selectedProduct.subCategory?.name}
                readOnly
              />
              <label htmlFor="price">Price</label>
              <input
                type="text"
                id="price"
                defaultValue={`${selectedProduct.price} $`}
                readOnly
              />
              <label htmlFor="material">Material</label>
              <input
                type="text"
                id="material"
                defaultValue={selectedProduct.material}
                readOnly
              />
              <label htmlFor="fabric">Fabric</label>
              <input
                type="text"
                id="fabric"
                defaultValue={selectedProduct.fabric}
                readOnly
              />
              <label htmlFor="fit">Fit</label>
              <input
                type="text"
                id="fit"
                defaultValue={selectedProduct.fit}
                readOnly
              />
              <label htmlFor="sku">SKU</label>
              <input
                type="text"
                id="sku"
                defaultValue={selectedProduct.sku}
                readOnly
              />
              <label htmlFor="stock">Stock</label>
              <input
                type="text"
                id="stock"
                defaultValue={selectedProduct.stock}
                readOnly
              />
              <label htmlFor="ratings">Total Ratings</label>
              <input
                type="text"
                id="ratings"
                defaultValue={selectedProduct.totalRatings}
                readOnly
              />
              <label htmlFor="reviews">Reviews</label>
              <textarea
                id="reviews"
                rows="3"
                defaultValue={
                  selectedProduct.reviews.length > 0
                    ? selectedProduct.reviews.join(", ")
                    : "No reviews"
                }
                readOnly
              />
              <label htmlFor="variants">Variants</label>
              <textarea
                id="variants"
                rows="3"
                defaultValue={selectedProduct.variants
                  .map(
                    (variant) =>
                      `Color: ${variant.color}, Sizes: ${variant.sizes
                        .map((size) => size.size)
                        .join(", ")}`
                  )
                  .join("\n")}
                readOnly
              />
            </FormSection>

            <ButtonGroup>
              <button type="button" className="cancel" onClick={closeDialog}>
                Close
              </button>
              <button type="button" className="continue" onClick={closeDialog}>
                Done
              </button>
            </ButtonGroup>
          </form>
        )}
      </Dialog>
      {showEditModal && (
        <EditProductModal
          show={showEditModal}
          onClose={closeEditModal}
          product={selectedProduct} // Make sure this passes a valid product object
        />
      )}
    </RecentOrderWrap>
  );
}

export default ProductsTable;
