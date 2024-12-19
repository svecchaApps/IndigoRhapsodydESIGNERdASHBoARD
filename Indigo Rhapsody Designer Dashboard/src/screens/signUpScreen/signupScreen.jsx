import React, { useState } from "react";
import { storage } from "../../service/firebaseService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./SIgnupScreen.css";

function SignupScreen() {
  const [formData, setFormData] = useState({
    displayName: "",
    phoneNumber: "",
    email: "",
    password: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
  });
  const [errors, setErrors] = useState({});
  const [logoUrl, setLogoURL] = useState("");
  const [backgroundImageUrl, setBackgroundURL] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // Modal state

  const validateFields = (name, value) => {
    let newErrors = { ...errors };

    if (name === "phoneNumber") {
      const phoneRegex = /^\+91\d{10}$/;
      newErrors.phoneNumber = phoneRegex.test(value)
        ? ""
        : "Phone number must be in the format +91XXXXXXXXXX";
    }

    if (name === "pincode") {
      const pincodeRegex = /^\d{6}$/;
      newErrors.pincode = pincodeRegex.test(value)
        ? ""
        : "Pin code must be exactly 6 digits.";
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateFields(name, value);
  };

  const handleFileUpload = async (e, setURL, folder) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileRef = ref(storage, `${folder}/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    setURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.password ||
      !logoUrl ||
      !backgroundImageUrl ||
      errors.phoneNumber ||
      errors.pincode
    ) {
      alert("Please fill all fields correctly.");
      return;
    }

    const requestBody = { ...formData, logoUrl, backgroundImageUrl };

    try {
      const response = await fetch(
        "https://indigo-rhapsody-backend-ten.vercel.app/user/user-designer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        console.log("Request Body:", JSON.stringify(requestBody, null, 2));
        alert("Sign-up successful!");
        setShowModal(true); // Show success modal only if API is successful
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        alert("Error: " + (errorData.message || "Sign-up failed"));
      }
    } catch (error) {
      console.error("Network Error:", error.message);
      alert("Error during sign-up. Please try again later.");
    }
  };

  const handleContinue = () => {
    navigate("/");
  };
  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="signup-header">
          <h2>Let’s get you started</h2>
          <p>Enter the details to Join Indigo Rhapsody</p>
        </div>

        <div className="input-group">
          <label>Display Name</label>
          <input
            type="text"
            name="displayName"
            placeholder="Your Display Name"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="+91XXXXXXXXXX"
            onChange={handleInputChange}
            required
          />
          {errors.phoneNumber && (
            <span className="error">{errors.phoneNumber}</span>
          )}
        </div>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Logo</label>
          <input
            type="file"
            onChange={(e) => handleFileUpload(e, setLogoURL, "logos")}
            required
          />
        </div>
        <div className="input-group">
          <label>Background</label>
          <input
            type="file"
            onChange={(e) =>
              handleFileUpload(e, setBackgroundURL, "backgrounds")
            }
            required
          />
        </div>
        <div className="form-section">
          <div className="input-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter your Address"
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label>Pin Code</label>
            <input
              type="text"
              name="pincode"
              placeholder="Enter your Pin Code"
              onChange={handleInputChange}
              required
            />
            {errors.pincode && <span className="error">{errors.pincode}</span>}
          </div>
        </div>
        <div className="form-section">
          <div className="input-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              placeholder="Enter your City"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="form-section">
          <div className="input-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              placeholder="Enter your State"
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-action">
          <button type="submit" className="submit-btn">
            Sign Up
          </button>
        </div>
      </form>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="success-icon">✔</div>
            <h3>SUCCESS</h3>
            <p>Congratulations, your account has been successfully created.</p>
            <button onClick={handleContinue} className="modal-btn">
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignupScreen;
