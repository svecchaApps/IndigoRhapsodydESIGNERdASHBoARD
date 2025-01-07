import React, { useState } from "react";
import { storage } from "../../service/firebaseService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./signupScreen.css";
import logo from "../../assets/images/Asset_3.webp";

function SignupScreen() {
  const [step, setStep] = useState(1); // Track current step
  const [formData, setFormData] = useState({
    displayName: "",
    phoneNumber: "",
    email: "",
    password: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    role: "Designer",
  });
  const [errors, setErrors] = useState({});
  const [logoUrl, setLogoURL] = useState("");
  const [backgroundImageUrl, setBackgroundURL] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const validateFields = (fields) => {
    let newErrors = {};
    let isValid = true;

    fields.forEach((field) => {
      const value = formData[field];
      if (!value) {
        newErrors[field] = "This field is required";
        isValid = false;
      }

      if (field === "phoneNumber") {
        const phoneRegex = /^\+91\d{10}$/;
        if (!phoneRegex.test(value)) {
          newErrors.phoneNumber =
            "Phone number must be in the format +91XXXXXXXXXX";
          isValid = false;
        }
      }

      if (field === "pincode") {
        const pincodeRegex = /^\d{6}$/;
        if (!pincodeRegex.test(value)) {
          newErrors.pincode = "Pin code must be exactly 6 digits.";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileUpload = async (e, setURL, folder) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileRef = ref(storage, `${folder}/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    setURL(url);
  };

  const handleNext = () => {
    const stepFields = {
      1: ["displayName", "phoneNumber"],
      2: ["email", "password"],
      3: [], // No validation for file upload
      4: ["address", "pincode", "city", "state"],
    };

    if (validateFields(stepFields[step])) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
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
        setShowModal(true);
      } else {
        const errorData = await response.json();
        alert("Error: " + (errorData.message || "Sign-up failed"));
      }
    } catch (error) {
      alert("Error during sign-up. Please try again later.");
    }
  };

  const handleContinue = () => {
    navigate("/");
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <div className="logo-section">
          <img src={logo} alt="Brand Logo" className="logo" />
        </div>
        <h2>Sign Up</h2>
        <p>
          Create Your Account in <strong>4 Easy Steps</strong>
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="progress-bar">
        <div className={`step ${step >= 1 ? "active" : ""}`}>Step 1</div>
        <div className={`step ${step >= 2 ? "active" : ""}`}>Step 2</div>
        <div className={`step ${step >= 3 ? "active" : ""}`}>Step 3</div>
        <div className={`step ${step === 4 ? "active" : ""}`}>Step 4</div>
      </div>

      <form className="signup-form" onSubmit={handleSubmit}>
        {/* Step 1: Display Name & Phone Number */}
        {step === 1 && (
          <div className="step-content">
            <div className="input-group">
              <label>Display Name</label>
              <input
                type="text"
                name="displayName"
                placeholder="Your Display Name"
                value={formData.displayName}
                onChange={handleInputChange}
              />
              {errors.displayName && (
                <span className="error">{errors.displayName}</span>
              )}
            </div>
            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="+91XXXXXXXXXX"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
              {errors.phoneNumber && (
                <span className="error">{errors.phoneNumber}</span>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Email & Password */}
        {step === 2 && (
          <div className="step-content">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Your Email Address"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Logo & Background Upload */}
        {step === 3 && (
          <div className="step-content">
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
          </div>
        )}

        {/* Step 4: Address, Pincode, City & State */}
        {step === 4 && (
          <div className="step-content">
            <div className="input-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter your Address"
                value={formData.address}
                onChange={handleInputChange}
              />
              {errors.address && (
                <span className="error">{errors.address}</span>
              )}
            </div>
            <div className="input-group">
              <label>Pin Code</label>
              <input
                type="text"
                name="pincode"
                placeholder="Enter your Pin Code"
                value={formData.pincode}
                onChange={handleInputChange}
              />
              {errors.pincode && (
                <span className="error">{errors.pincode}</span>
              )}
            </div>
            <div className="input-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="Enter your City"
                value={formData.city}
                onChange={handleInputChange}
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>
            <div className="input-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                placeholder="Enter your State"
                value={formData.state}
                onChange={handleInputChange}
              />
              {errors.state && <span className="error">{errors.state}</span>}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-action">
          {step > 1 && (
            <button type="button" className="back-btn" onClick={handleBack}>
              Back
            </button>
          )}
          {step < 4 && (
            <button type="button" className="next-btn" onClick={handleNext}>
              Next
            </button>
          )}
          {step === 4 && (
            <button type="submit" className="submit-btn">
              Submit
            </button>
          )}
        </div>
      </form>

      {/* Success Modal */}
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
