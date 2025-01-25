import React, { useState } from "react";
import { storage } from "../../service/firebaseService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./stylesheet.css";
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
    logoUrl: "",
    backgroundImageUrl: "",
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Fields to validate at each step
  const stepFields = {
    1: ["displayName", "phoneNumber"],
    2: ["email", "password"],
    3: ["logoUrl", "backgroundImageUrl"],
    4: ["address", "pincode", "city", "state"],
  };

  /**
   * Validate the given list of fields from formData.
   * Returns true if all valid, otherwise false.
   */
  const validateFields = (fields) => {
    let newErrors = { ...errors }; // start with existing errors to preserve them
    let isValid = true;

    // Clear errors only for the fields we are validating now
    fields.forEach((field) => {
      delete newErrors[field];
    });

    fields.forEach((field) => {
      const value = formData[field];

      // Check if value is empty
      if (!value) {
        newErrors[field] = "This field is required";
        isValid = false;
      }

      // Additional validations
      if (field === "phoneNumber" && value) {
        const phoneRegex = /^\+91\d{10}$/;
        if (!phoneRegex.test(value)) {
          newErrors.phoneNumber =
            "Phone number must be in the format +91XXXXXXXXXX";
          isValid = false;
        }
      }

      if (field === "pincode" && value) {
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

  // Handle all input changes
  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    // Update formData
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear existing errors for this field if any
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // If user is typing pincode, and it meets the length of 6 digits, call the API
    if (name === "pincode") {
      // Reset city and state if pincode changes
      setFormData((prev) => ({ ...prev, city: "", state: "" }));

      if (value.length === 6) {
        try {
          const response = await fetch(
            `https://api.postalpincode.in/pincode/${value}`
          );
          const data = await response.json();

          if (data && data[0] && data[0].Status === "Success") {
            const postOfficeInfo = data[0].PostOffice[0];
            if (postOfficeInfo) {
              setFormData((prev) => ({
                ...prev,
                city: postOfficeInfo.District || "",
                state: postOfficeInfo.State || "",
              }));
            }
          } else {
            console.error("Invalid pincode or API error:", data);
          }
        } catch (error) {
          console.error("Error fetching pincode details:", error);
        }
      }
    }
  };

  // Handle file uploads for Logo / Background
  const handleFileUpload = async (e, fieldName, folder) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileRef = ref(storage, `${folder}/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      setFormData((prev) => ({
        ...prev,
        [fieldName]: url,
      }));

      // Clear existing errors for this field if any
      if (errors[fieldName]) {
        setErrors((prev) => ({ ...prev, [fieldName]: "" }));
      }
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  // Move to next step after validation
  const handleNext = () => {
    if (validateFields(stepFields[step])) {
      setStep(step + 1);
    }
  };

  // Move back to previous step
  const handleBack = () => {
    setStep(step - 1);
  };

  // Final form submit (at Step 4)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate step 4 fields before sending data
    if (!validateFields(stepFields[4])) {
      return;
    }

    // Everything is valid up to step 4, proceed with API call
    const requestBody = { ...formData };

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

  // On success, continue to next route
  const handleContinue = () => {
    navigate("/");
  };

  return (
    <div className="signup-container">

      {/* <div className="signup-modal"> */}
      {/* Header */}
      <div className="signup-header">
        <img src={logo} alt="Brand Logo" className="logo" />
       
        <strong
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "black",
        }}
        >Create your Account</strong>
      </div>

      {/* Main Content: Vertical Progress + Form */}
      <div className="main-content">
        {/* Vertical Progress Bar */}
        {/* <div className="progress-bar">
    
          <div className={`step ${step >= 1 ? "active" : ""}`}>
            Roshni 1
          </div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>
          Roshni 2
          </div>
          <div className={`step ${step >= 3 ? "active" : ""}`}>
          Roshni 3
          </div>
          <div className={`step ${step === 4 ? "active" : ""}`}>
          Roshni 4
          </div>
        </div> */}
<div className="progress-bar">
  <div className={`step ${step >= 1 ? "active" : ""}`}>
    <span className="circle">1</span>
    <span className="label">Login</span>
  </div>
  <div className={`step ${step >= 2 ? "active" : ""}`}>
    <span className="circle">2</span>
    <span className="label">Information</span>
  </div>
  <div className={`step ${step >= 3 ? "active" : ""}`}>
    <span className="circle">3</span>
    <span className="label">Image</span>
  </div>
  <div className={`step ${step === 4 ? "active" : ""}`}>
    <span className="circle">4</span>
    <span className="label">Address</span>
  </div>
</div>

        {/* Form Container */}
        <div className="form-container">
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
                    maxLength={13}
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
                  {errors.email && (
                    <span className="error">{errors.email}</span>
                  )}
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
                    onChange={(e) => handleFileUpload(e, "logoUrl", "logos")}
                  />
                  {errors.logoUrl && (
                    <span className="error">{errors.logoUrl}</span>
                  )}
                </div>
                <div className="input-group">
                  <label>Background</label>
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileUpload(e, "backgroundImageUrl", "backgrounds")
                    }
                  />
                  {/* {errors.backgroundImageUrl && (
                    <span className="error">{errors.backgroundImageUrl}</span>
                  )} */}
                </div>
              </div>
            )}

            {/* Step 4: Address, Pincode, City & State */}
            {step === 4 && (
              <div className="step-content">
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
                  {/* <label>City</label> */}
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter your City"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                  {errors.city && (
                    <span className="error">{errors.city}</span>
                  )}
                </div>
                <div className="input-group">
                  {/* <label>State</label> */}
                  <input
                    type="text"
                    name="state"
                    placeholder="Enter your State"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                  {errors.state && (
                    <span className="error">{errors.state}</span>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="form-action">
              {/* {step > 1 && (
                <button type="button" className="back-btn" onClick={handleBack}>
                  Back
                </button>
              )} */}
              {step < 4 && (
                <button type="button" className="next-btn" onClick={handleNext}
                style={{
                 marginTop: "30px",
                }}
                >
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
        </div>
      </div>

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
      {/* </div> */}
    </div>
  );
}

export default SignupScreen;
