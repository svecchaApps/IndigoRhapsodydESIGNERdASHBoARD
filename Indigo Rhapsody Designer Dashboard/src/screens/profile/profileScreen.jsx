import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  dashBoardDesigner,
  updateProfileRequest,
} from "../../service/userProfile";
import { storage } from "../../service/firebaseService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Styled components for styling
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: #f4f6f8;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 40px;
  margin: 0 auto;
  max-width: 100%;
  max-height: 100%;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  img {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    margin-right: 20px;
  }
  .profile-info {
    h2 {
      margin: 0;
    }
    p {
      margin: 0;
      color: #555;
      font-size: 0.9em;
    }
  }
`;

const EditButton = styled.span`
  margin-left: auto;
  cursor: pointer;
  color: ${(props) => props.theme.colors.blue};
  &:hover {
    text-decoration: underline;
  }
`;

const Form = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  label {
    display: block;
    margin-bottom: 5px;
    font-size: 0.85em;
    color: #666;
  }
  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1em;
  }
`;

const IntegrationSection = styled.div`
  margin-top: 30px;
  h3 {
    font-size: 1em;
    margin-bottom: 10px;
  }
  p {
    margin-bottom: 10px;
    font-size: 0.85em;
    color: #555;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  width: 600px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 20px;
  }

  img {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    margin-bottom: 20px;
    border: 2px solid #ddd;
  }

  form {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;

    label {
      display: block;
      margin-bottom: 5px;
      font-size: 0.85em;
      color: #666;
    }

    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 1em;
    }

    .full-width {
      grid-column: span 2;
    }

    button {
      grid-column: span 2;
      padding: 10px;
      background-color: ${(props) => props.theme.colors.blue};
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1em;
      margin-top: 10px;

      &:hover {
        background-color: #0056b3;
      }
    }

    .cancel-button {
      background-color: #6c757d;
      &:hover {
        background-color: #5a6268;
      }
    }
  }
`;

const uploadImageToFirebase = async (file, folder = "ProfileImages") => {
  try {
    const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    throw new Error("Failed to upload image");
  }
};

const ProfileScreen = () => {
  const [designer, setDesigner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backgroundFile, setBackgroundFile] = useState(null);

  useEffect(() => {
    const fetchDesignerDetails = async () => {
      try {
        const data = await dashBoardDesigner(); // Fetch designer details from API
        setDesigner(data.designer);
        setFormData(data.designer.userId); // Pre-fill form data with existing user data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDesignerDetails();
  }, []);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.name === "logoFile") {
      setLogoFile(e.target.files[0]);
    } else if (e.target.name === "backgroundFile") {
      setBackgroundFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedLogoUrl = designer.logoUrl;
      let updatedBackgroundUrl = designer.backGroundImage;

      if (logoFile) {
        updatedLogoUrl = await uploadImageToFirebase(logoFile, "Logo");
      }

      if (backgroundFile) {
        updatedBackgroundUrl = await uploadImageToFirebase(
          backgroundFile,
          "Background"
        );
      }

      const updatedData = {
        ...formData,
        logoUrl: updatedLogoUrl,
        backGroundImage: updatedBackgroundUrl,
      };

      await updateProfileRequest(updatedData, logoFile, backgroundFile);
      setIsModalOpen(false);

      // Notify user of success
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error submitting profile update request:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  return (
    <ProfileContainer>
      <MainContent>
        <ProfileHeader>
          <img
            src={designer.logoUrl || "https://via.placeholder.com/100"}
            alt="Profile"
          />
          <div className="profile-info">
            <h2>{designer.userId.displayName} (Designer)</h2>
            <p>{designer.shortDescription}</p>
          </div>
          <EditButton onClick={handleEditClick}>Edit information</EditButton>
        </ProfileHeader>
        <Form>
          <div>
            <label>Full name*</label>
            <input type="text" value={designer.userId.displayName} readOnly />
          </div>
          <div>
            <label>Email*</label>
            <input type="email" value={designer.userId.email} readOnly />
          </div>
          <div>
            <label>Phone</label>
            <input
              type="text"
              value={designer.userId.phoneNumber || "N/A"}
              readOnly
            />
          </div>
          <div>
            <label>Address</label>
            <input
              type="text"
              value={designer.userId.address[0].street_details || "N/A"}
              readOnly
            />
          </div>
          <div>
            <label>About</label>
            <input type="text" value={designer.about} readOnly />
          </div>
        </Form>
        <IntegrationSection>
          <h3>Background Image</h3>
          {designer.backGroundImage && (
            <img
              src={designer.backGroundImage}
              alt="Background"
              style={{ width: "100%", borderRadius: "10px", marginTop: "20px" }}
            />
          )}
        </IntegrationSection>
      </MainContent>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h2>Edit Profile</h2>
            <form onSubmit={handleFormSubmit}>
              <div>
                <label>First Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="full-width">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="full-width">
                <label>Contact Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="full-width">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="full-width">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="full-width">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="full-width">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="full-width">
                <label>Upload Logo</label>
                <input
                  type="file"
                  name="logoFile"
                  onChange={handleFileChange}
                />
              </div>
              <div className="full-width">
                <label>Upload Background Image</label>
                <input
                  type="file"
                  name="backgroundFile"
                  onChange={handleFileChange}
                />
              </div>

              <button type="submit">Save</button>
              <button
                type="button"
                className="cancel-button"
                onClick={handleModalClose}
              >
                Cancel
              </button>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </ProfileContainer>
  );
};

export default ProfileScreen;
