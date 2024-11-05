import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaUpload } from "react-icons/fa";
import {
  getCategory,
  getSubCategory,
  updateProduct,
} from "../../service/addProductsService";
import { storage } from "../../service/firebaseService"; // Import the storage instance
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ModalOverlay = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  width: 100%;
  z-index: 1000;
  overflow-y: auto;
  max-height: 90vh;
`;

const FormSection = styled.div`
  margin-bottom: 20px;

  h4 {
    margin-bottom: 10px;
  }

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
  }

  .input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;

    .add-button {
      padding: 0 10px;
      border: none;
      background-color: #28a745;
      color: #fff;
      border-radius: 5px;
      cursor: pointer;
    }
  }

  .drop-zone {
    border: 2px dashed #ccc;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    margin-bottom: 10px;
    position: relative;

    &:hover {
      background-color: #f9f9f9;
    }

    p {
      margin: 10px 0;
      color: #666;
    }
  }

  .image-preview {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 10px;

    .image-container {
      position: relative;
      img {
        width: 70px;
        height: 70px;
        object-fit: cover;
        border-radius: 5px;
      }
      .remove-btn {
        position: absolute;
        top: -5px;
        right: -5px;
        background-color: red;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 12px;
        padding: 2px 5px;
      }
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &.save {
      background-color: #007bff;
      color: #fff;
    }

    &.cancel {
      background-color: #f0f0f0;
      color: #333;
    }
  }
`;

function EditProductModal({ show, onClose, product }) {
  const [coverImage, setCoverImage] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    product.category?.name || ""
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    product.subCategory?.name || ""
  );
  const [coverImageUrl, setCoverImageUrl] = useState(product.coverImage || "");
  const [imageUrls, setImageUrls] = useState(
    product.variants.flatMap((v) => v.imageList) || []
  );

  const [formData, setFormData] = useState({
    productName: product.productName || "",
    description: product.description || "",
    price: product.price || "",
    sku: product.sku || "",
    fit: product.fit || "",
    fabric: product.fabric || "",
    material: product.material || "",
  });

  useEffect(() => {
    if (show) {
      const fetchInitialData = async () => {
        try {
          const subCategoryData = await getSubCategory();
          setSubCategories(subCategoryData.subCategories || []);
        } catch (error) {
          // console.error("Failed to fetch subcategories:", error);
        }
      };
      fetchInitialData();
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      const fetchCategories = async () => {
        try {
          const categoryData = await getCategory();
          setCategories(categoryData.categories || []);
        } catch (error) {
          // console.error("Failed to fetch categories:", error);
        }
      };
      fetchCategories();
    }
  }, [show]);

  const [variants, setVariants] = useState(
    product.variants || [
      { color: "", sizes: [{ size: "", price: "", stock: "" }] },
    ]
  );

  const handleAddColor = () => {
    setVariants([
      ...variants,
      { color: "", sizes: [{ size: "", price: "", stock: "" }] },
    ]);
  };

  const handleAddSize = (colorIndex) => {
    const newVariants = [...variants];
    newVariants[colorIndex].sizes.push({ size: "", price: "", stock: "" });
    setVariants(newVariants);
  };

  const handleVariantChange = (e, colorIndex, sizeIndex = null, field) => {
    const { value } = e.target;
    const newVariants = [...variants];
    if (sizeIndex === null) {
      newVariants[colorIndex][field] = value;
    } else {
      newVariants[colorIndex].sizes[sizeIndex][field] = value;
    }
    setVariants(newVariants);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const url = await uploadImageToFirebase(file);
      setCoverImageUrl(url);
    }
  };

  const handleImageListChange = async (e) => {
    const files = Array.from(e.target.files);
    setImageList(files);

    const uploadedUrls = await Promise.all(
      files.map((file) => uploadImageToFirebase(file))
    );
    setImageUrls(uploadedUrls);
  };

  const handleRemoveImage = (index) => {
    setImageList((prevImages) => prevImages.filter((_, i) => i !== index));
    setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  const uploadImageToFirebase = async (file) => {
    try {
      const fileRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      return url;
    } catch (error) {
      // console.error("Error uploading image to Firebase:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        category: selectedCategory,
        subCategory: selectedSubCategory,
        variants: variants,
        imageUrls: imageUrls,
        coverImage: coverImageUrl,
      };

      // console.log("Product data being sent:", productData);

      const response = await updateProduct(product._id, productData);
      // console.log("Product updated successfully:", response);
      onClose();
      window.location.reload();
    } catch (error) {
      // console.error("Error updating product:", error.message);
      alert("Failed to update product");
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay show={show} onClick={handleOverlayClick}>
      <ModalContent>
        <h3>Edit Product</h3>
        <form onSubmit={handleSubmit}>
          <FormSection>
            <h4>Upload Cover Image</h4>
            <div className="drop-zone">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                style={{ display: "none" }}
                id="coverImageUpload"
              />
              <label htmlFor="coverImageUpload">
                <FaUpload size={30} color="#888" />
                <p>Drag & drop or click to upload a cover image</p>
              </label>
              {coverImage && (
                <div className="image-preview">
                  <img
                    src={URL.createObjectURL(coverImage)}
                    alt="Cover Preview"
                  />
                </div>
              )}
            </div>
          </FormSection>

          <FormSection>
            <h4>Upload Image List</h4>
            <div className="drop-zone">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageListChange}
                style={{ display: "none" }}
                id="imageListUpload"
              />
              <label htmlFor="imageListUpload">
                <FaUpload size={30} color="#888" />
                <p>Drag & drop or click to upload images</p>
              </label>
            </div>
            {imageList.length > 0 && (
              <div className="image-preview">
                {imageList.map((image, index) => (
                  <div className="image-container" key={index}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index}`}
                    />
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </FormSection>

          <FormSection>
            <h4>General Information</h4>
            <label>Product Name</label>
            <input
              type="text"
              name="productName"
              placeholder="Enter product name"
              value={formData.productName}
              onChange={handleInputChange}
            />
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </FormSection>

          <FormSection>
            <h4>Price</h4>
            <input
              type="number"
              name="price"
              placeholder="Base Price"
              value={formData.price}
              onChange={handleInputChange}
            />
          </FormSection>

          <FormSection>
            <h4>Meta data</h4>
            <input
              type="text"
              name="sku"
              placeholder="SKU"
              value={formData.sku}
              onChange={handleInputChange}
            />
          </FormSection>

          <FormSection>
            <h4>Fit</h4>
            <input
              type="text"
              name="fit"
              placeholder="Fit-Product"
              value={formData.fit}
              onChange={handleInputChange}
            />
          </FormSection>

          <FormSection>
            <h4>Fabric</h4>
            <input
              type="text"
              name="fabric"
              placeholder="Fabric Type"
              value={formData.fabric}
              onChange={handleInputChange}
            />
          </FormSection>

          <FormSection>
            <h4>Material</h4>
            <input
              type="text"
              name="material"
              placeholder="Material Type"
              value={formData.material}
              onChange={handleInputChange}
            />
          </FormSection>

          <FormSection>
            <h4>Variants</h4>
            {variants.map((variant, colorIndex) => (
              <div key={colorIndex}>
                <label>Color</label>
                <input
                  type="text"
                  placeholder="Color"
                  value={variant.color}
                  onChange={(e) =>
                    handleVariantChange(e, colorIndex, null, "color")
                  }
                />
                {variant.sizes.map((size, sizeIndex) => (
                  <div key={sizeIndex} className="input-group">
                    <input
                      type="text"
                      placeholder="Size"
                      value={size.size}
                      onChange={(e) =>
                        handleVariantChange(e, colorIndex, sizeIndex, "size")
                      }
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={size.price}
                      onChange={(e) =>
                        handleVariantChange(e, colorIndex, sizeIndex, "price")
                      }
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={size.stock}
                      onChange={(e) =>
                        handleVariantChange(e, colorIndex, sizeIndex, "stock")
                      }
                    />
                    <button
                      type="button"
                      className="add-button"
                      onClick={() => handleAddSize(colorIndex)}
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            ))}
            <button
              type="button"
              className="add-button"
              onClick={handleAddColor}
            >
              + Add Color
            </button>
          </FormSection>

          <FormSection>
            <h4>Category</h4>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </FormSection>

          <FormSection>
            <h4>SubCategory</h4>
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
            >
              <option value="">Select SubCategory</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory._id} value={subCategory._id}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </FormSection>

          <ButtonGroup>
            <button type="button" className="cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save">
              Save Changes
            </button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default EditProductModal;
