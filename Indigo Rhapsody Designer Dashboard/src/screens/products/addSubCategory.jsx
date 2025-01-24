import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { storage } from "../../service/firebaseService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getCategory, AddCategory } from "../../service/addProductsService";

const { Option } = Select;

const AddSubCategoryModal = ({ visible, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategory();
        setCategories(data.categories);
      } catch (error) {
        message.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = ({ file: newFile }) => {
    if (newFile && newFile.type.startsWith("image/")) {
      setFile(newFile.originFileObj || newFile);
    } else {
      message.error("Only image files are allowed.");
      setFile(null);
    }
  };

  const uploadImageToFirebase = async (file) => {
    try {
      const fileRef = ref(storage, `subcategory/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Error during upload:", error);
      throw new Error("Failed to upload image. Please try again.");
    }
  };

  const handleAddSubCategory = async (values) => {
    if (!file) {
      message.error("Please select an image before submitting.");
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadImageToFirebase(file);

      const subcategoryData = {
        name: values.name,
        categoryId: values.category,
        image: imageUrl,
      };

      await AddCategory(subcategoryData);
      message.success("Subcategory added successfully");
      form.resetFields();
      setFile(null);
      onClose();
    } catch (error) {
      message.error(error.message || "Error adding subcategory");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Add Subcategory"
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={uploading}
    >
      <Form form={form} layout="vertical" onFinish={handleAddSubCategory}>
        <Form.Item
          name="category"
          label="Select Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="Select a category">
            {categories.map((category) => (
              <Option key={category._id} value={category._id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="name"
          label="Subcategory Name"
          rules={[{ required: true, message: "Please enter subcategory name" }]}
        >
          <Input placeholder="Enter subcategory name" />
        </Form.Item>
        <Form.Item label="Upload Image"
        rules={[{ required: true, message: "Please upload an image" }]}
        >
          <div>
            <Upload
              beforeUpload={() => false} // Prevent automatic upload by Ant Design
              onChange={handleFileChange}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
            {file && <p>{file.name}</p>}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSubCategoryModal;
