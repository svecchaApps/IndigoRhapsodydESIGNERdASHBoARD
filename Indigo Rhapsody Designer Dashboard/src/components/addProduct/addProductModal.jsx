// AddProductModal.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaUpload } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getCategory,
  getSubCategory,
  createProduct,
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
    margin-bottom: 5px;
    border-radius: 5px;
    border: 1px solid #ddd;
  }

  .input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;

    .add-button,
    .remove-button {
      padding: 0 10px;
      border: none;
      background-color: #28a745;
      color: #fff;
      border-radius: 5px;
      cursor: pointer;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-button {
      background-color: #dc3545;
    }
  }

  .error-text {
    color: red;
    font-size: 0.85rem;
    margin-bottom: 5px;
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

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

function AddProductModal({ show, onClose }) {
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State to store field values
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    sku: "",
    fit: "",
    fabric: "",
    material: "",
    mrp: "",
  });

  // State to store field errors
  const [errors, setErrors] = useState({});

  // Variants array
  const [variants, setVariants] = useState([
    {
      color: "",
      sizes: [{ size: "", price: "", stock: "" }],
      imageList: [],
    },
  ]);

  // Fetch Categories on modal open
  useEffect(() => {
    if (show) {
      const fetchCategories = async () => {
        try {
          const categoryData = await getCategory();
          // Adjust to match your API response structure
          setCategories(categoryData.categories || []);
        } catch (error) {
          console.error("Failed to fetch categories:", error);
        }
      };
      fetchCategories();
    }
  }, [show]);

  // Fetch SubCategories when a category is selected
  useEffect(() => {
    if (selectedCategory) {
      const fetchSubCategories = async () => {
        try {
          const subCategoryData = await getSubCategory(selectedCategory);
          setSubCategories(subCategoryData.subCategories || []);
        } catch (error) {
          console.error("Failed to fetch subcategories:", error);
        }
      };
      fetchSubCategories();
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory]);

  // =========================
  //        HANDLERS
  // =========================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Ensure that price is a non-negative value
    if (name === "price" && value < 0) {
      return; // Do nothing if the value is negative
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // Variant logic
  const handleAddColor = () => {
    setVariants([
      ...variants,
      { color: "", sizes: [{ size: "", price: "", stock: "" }], imageList: [] },
    ]);
  };

  const handleRemoveColorVariant = (colorIndex) => {
    const newVariants = [...variants];
    newVariants.splice(colorIndex, 1);
    setVariants(newVariants);
  };

  const handleAddSize = (colorIndex) => {
    const newVariants = [...variants];
    newVariants[colorIndex].sizes.push({ size: "", price: "", stock: "" });
    setVariants(newVariants);
  };

  const handleRemoveSize = (colorIndex, sizeIndex) => {
    const newVariants = [...variants];
    newVariants[colorIndex].sizes.splice(sizeIndex, 1);
    setVariants(newVariants);
  };

  const handleVariantChange = (e, colorIndex, sizeIndex = null, field) => {
    const { value } = e.target;

    // Ensure the value is a valid number and is non-negative
    let newValue = value;

    if (field === "price" || field === "stock") {
      newValue = Math.max(0, parseFloat(value)); // If negative, reset to 0
    }

    const newVariants = [...variants];

    if (sizeIndex === null) {
      newVariants[colorIndex][field] = newValue;
    } else {
      newVariants[colorIndex].sizes[sizeIndex][field] = newValue;
    }

    setVariants(newVariants);
  };

  // Firebase image upload
  const uploadImageToFirebase = async (file) => {
    try {
      const fileRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      return url;
    } catch (error) {
      throw new Error("Failed to upload image");
    }
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setCoverImage(file);
      const url = await uploadImageToFirebase(file);
      setCoverImageUrl(url);
      toast.success("Cover image uploaded successfully.");
    } catch (error) {
      toast.error("Failed to upload cover image. Please try again.");
    }
  };

  const handleVariantImageChange = async (e, colorIndex) => {
    const files = Array.from(e.target.files);
    try {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          return await uploadImageToFirebase(file);
        })
      );
      const newVariants = [...variants];
      newVariants[colorIndex].imageList = [
        ...newVariants[colorIndex].imageList,
        ...uploadedUrls,
      ];
      setVariants(newVariants);
    } catch (error) {
      alert("Failed to upload some images");
    }
  };

  const handleRemoveVariantImage = (colorIndex, imageIndex) => {
    const newVariants = [...variants];
    newVariants[colorIndex].imageList = newVariants[
      colorIndex
    ].imageList.filter((_, i) => i !== imageIndex);
    setVariants(newVariants);
  };

  // Validation
  const validateFields = () => {
    const newErrors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = "Product Name is required.";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be a positive number.";
    }
    if (!formData.sku.trim()) {
      newErrors.sku = "Meta Data is required.";
    }
    if (!formData.fit.trim()) {
      newErrors.fit = "Fit is required.";
    }
    if (!formData.fabric.trim()) {
      newErrors.fabric = "Fabric is required.";
    }
    if (!formData.material.trim()) {
      newErrors.material = "Material is required.";
    }
    if (!selectedCategory) {
      newErrors.category = "Category is required.";
    }
    if (!selectedSubCategory) {
      newErrors.subCategory = "Subcategory is required.";
    }

    return newErrors;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const productData = {
        ...formData,
        category: selectedCategory,
        subCategory: selectedSubCategory,
        // Optionally include coverImageUrl in productData if your API expects it
        coverImageUrl,
        variants,
      };

      // Call your API
      const response = await createProduct(productData);

      toast.success("Product created successfully!");
      onClose();
      // If you want to refresh the page or re-fetch data:
      window.location.reload();
    } catch (error) {
      toast.error(`Failed to create product: ${error.message}`);
    } finally {
      setIsLoading(false);
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
        {/* Toast for final success/error; can be placed here or in a higher component */}
        <ToastContainer />

        <h3>New Product</h3>
        <form onSubmit={handleSubmit}>
          {/* =============== VARIANTS SECTION =============== */}
          <FormSection>
            <h4>Variants</h4>
            {variants.map((variant, colorIndex) => (
              <div key={colorIndex} style={{ marginBottom: "15px" }}>
                {/* Color Field */}
                <div className="input-group">
                  <label style={{ width: "60px" }}>Color</label>
                  <input
                    type="text"
                    placeholder="Color"
                    value={variant.color}
                    onChange={(e) =>
                      handleVariantChange(e, colorIndex, null, "color")
                    }
                  />
                  {variants.length > 1 && (
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => handleRemoveColorVariant(colorIndex)}
                    >
                      Remove Color
                    </button>
                  )}
                </div>

                {/* Upload Images */}
                <label>Upload Images for {variant.color || "this color"}</label>
                <div className="drop-zone">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleVariantImageChange(e, colorIndex)}
                    style={{ display: "none" }}
                    id={`variantImageUpload-${colorIndex}`}
                  />
                  <label
                    htmlFor={`variantImageUpload-${colorIndex}`}
                    style={{ cursor: "pointer" }}
                  >
                    <FaUpload size={30} color="#888" />
                    <p>Drag & drop or click to upload images</p>
                  </label>
                </div>

                {/* Preview Images */}
                {variant.imageList.length > 0 && (
                  <div className="image-preview">
                    {variant.imageList.map((url, imageIndex) => (
                      <div className="image-container" key={imageIndex}>
                        <img
                          src={url}
                          alt={`Variant ${colorIndex} - Image ${imageIndex}`}
                        />
                        <button
                          className="remove-btn"
                          onClick={() =>
                            handleRemoveVariantImage(colorIndex, imageIndex)
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Size/Price/Stock Fields */}
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
                      min="0"
                      onChange={(e) =>
                        handleVariantChange(e, colorIndex, sizeIndex, "price")
                      }
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={size.stock}
                      min="0"
                      onChange={(e) =>
                        handleVariantChange(e, colorIndex, sizeIndex, "stock")
                      }
                    />
                    {sizeIndex === variant.sizes.length - 1 && (
                      <button
                        type="button"
                        className="add-button"
                        onClick={() => handleAddSize(colorIndex)}
                      >
                        + Size
                      </button>
                    )}
                    {variant.sizes.length > 1 && (
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() => handleRemoveSize(colorIndex, sizeIndex)}
                      >
                        - Size
                      </button>
                    )}
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
          {/* =============== COVER IMAGE SECTION (Optional) =============== */}
          <FormSection>
            <h4>Cover Image (Optional)</h4>
            <div className="drop-zone">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                style={{ display: "none" }}
                id="coverImageUpload"
              />
              <label htmlFor="coverImageUpload" style={{ cursor: "pointer" }}>
                <FaUpload size={30} color="#888" />
                <p>Drag & drop or click to upload cover image</p>
              </label>
            </div>
            {coverImageUrl && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={coverImageUrl}
                  alt="Cover"
                  style={{ width: "70px", height: "70px", objectFit: "cover" }}
                />
              </div>
            )}
          </FormSection>
          {/* =============== GENERAL INFO =============== */}
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
            {errors.productName && (
              <div className="error-text">{errors.productName}</div>
            )}

            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
            {errors.description && (
              <div className="error-text">{errors.description}</div>
            )}
          </FormSection>
          {/* =============== PRICE =============== */}
          <FormSection>
            <h4>Price</h4>
            <div className="input-group">
              <input
                type="number"
                name="price"
                min="0"
                placeholder="Base Price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
            {errors.price && <div className="error-text">{errors.price}</div>}
          </FormSection>{" "}
          <FormSection>
            <h4>Mrp</h4>
            <div className="input-group">
              <input
                type="number"
                name="mrp"
                min="0"
                placeholder="Mrp"
                value={formData.mrp}
                onChange={handleInputChange}
              />
            </div>
            {errors.price && <div className="error-text">{errors.price}</div>}
          </FormSection>
          {/* =============== META DATA =============== */}
          <FormSection>
            <h4>Meta data</h4>
            <div className="input-group">
              <input
                type="text"
                name="sku"
                placeholder="SKU"
                value={formData.sku}
                onChange={handleInputChange}
              />
            </div>
            {errors.sku && <div className="error-text">{errors.sku}</div>}
          </FormSection>
          {/* =============== FIT =============== */}
          <FormSection>
            <h4>Fit</h4>
            <div className="input-group">
              <input
                type="text"
                name="fit"
                placeholder="Fit-Product"
                value={formData.fit}
                onChange={handleInputChange}
              />
            </div>
            {errors.fit && <div className="error-text">{errors.fit}</div>}
          </FormSection>
          {/* =============== FABRIC =============== */}
          <FormSection>
            <h4>Fabric</h4>
            <div className="input-group">
              <input
                type="text"
                name="fabric"
                placeholder="Fabric Type"
                value={formData.fabric}
                onChange={handleInputChange}
              />
            </div>
            {errors.fabric && <div className="error-text">{errors.fabric}</div>}
          </FormSection>
          {/* =============== MATERIAL =============== */}
          <FormSection>
            <h4>Material</h4>
            <div className="input-group">
              <input
                type="text"
                name="material"
                placeholder="Material Type"
                value={formData.material}
                onChange={handleInputChange}
              />
            </div>
            {errors.material && (
              <div className="error-text">{errors.material}</div>
            )}
          </FormSection>
          {/* =============== CATEGORY =============== */}
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
            {errors.category && (
              <div className="error-text">{errors.category}</div>
            )}
          </FormSection>
          {/* =============== SUBCATEGORY =============== */}
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
          {/* =============== BUTTON GROUP =============== */}
          <ButtonGroup>
            <button type="button" className="cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Product"}
            </button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default AddProductModal;
