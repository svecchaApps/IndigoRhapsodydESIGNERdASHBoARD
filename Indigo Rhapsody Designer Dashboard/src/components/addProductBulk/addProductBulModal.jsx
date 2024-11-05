import React, { useState } from "react";
import styled from "styled-components";
import { FaUpload } from "react-icons/fa"; // Import the upload icon
import { uploadBulkExcel } from "../../service/addProductsService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the API function

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
  max-width: 500px;
  width: 100%;
  z-index: 1000;
`;

const DropZone = styled.div`
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background-color: #f9f9f9;
  }

  p {
    margin-top: 10px;
    color: #666;
  }
`;

const button = styled.div`
  .add-button {
    padding: 0 10px;
    border: none;
    background-color: #28a745;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 20px;

  .progress {
    height: 100%;
    background-color: #007bff;
    width: ${(props) => props.progress}%;
    transition: width 0.3s;
  }
`;

function UploadBulkModal({ show, onClose }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      setUploading(true);
      setProgress(30); // Initial progress
      try {
        // Simulate progress
        setProgress(50);
        const response = await uploadBulkExcel(file);
        setProgress(100);
        // console.log("Upload successful:", response);
        toast.success("Product created successfully!");

        onClose(); // Close the modal after upload
        window.location.reload(); // Refresh the page to reflect new data
      } catch (error) {
        setProgress(0);
        toast.error("Error Updlaoding Product");
        // console.error("Error uploading file:", error);
        alert("Failed to upload file. Please try again.");
      } finally {
        setUploading(false);
      }
    } else {
      alert("Please select a file to upload");
    }
  };

  return (
    <ModalOverlay
      show={show}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <ModalContent>
        <h3>Upload Bulk Products</h3>
        {uploading && (
          <ProgressBar progress={progress}>
            <div className="progress"></div>
          </ProgressBar>
        )}
        <DropZone>
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="fileUpload"
          />
          <label htmlFor="fileUpload">
            <FaUpload size={40} color="#888" />
            <p>Drag & drop or click to upload a file</p>
          </label>
        </DropZone>
        <button
          type="button"
          className="add-button"
          onClick={handleUpload}
          style={{ marginTop: "20px", padding: "10px 20px" }}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </ModalContent>
    </ModalOverlay>
  );
}

export default UploadBulkModal;
