import React, { useState, useEffect } from "react";
import Select from "react-select";
import { storage } from "../../service/firebaseService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./stylesheet.css";
import logo from "../../assets/images/Asset_3.webp";

// Universal Tutorial endpoints
const UT_BASE_URL = "https://www.universal-tutorial.com/api";
const AUTH_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJyYWphdGppZWRtQGdtYWlsLmNvbSIsImFwaV90b2tlbiI6IjlGNnhKQnZzWmt5TzBEclNNaXMyMThFWkNBdEhZaERTLTBmaC1GcDljbl9fU3JyajRlYXBWSmtlR1FqczQ1dUxyNXMifSwiZXhwIjoxNzM3NTM3Njg3fQ.pq1tZUKH515al7o_Rq-lnYyj7t2tWOuSMjZxqOIL8r8";
// Replace with your actual Bearer token if different

function SignupScreen() {
  const [step, setStep] = useState(1);
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

  // ----- For Select Fields -----
  // States
  const [statesOptions, setStatesOptions] = useState([]); // All states from UT
  const [selectedState, setSelectedState] = useState(null); // Selected state

  // Cities
  const [citiesOptions, setCitiesOptions] = useState([]); // All cities for the selected state
  const [selectedCity, setSelectedCity] = useState(null); // Selected city

  // Pin codes
  const [availablePincodes, setAvailablePincodes] = useState([]); // Pincodes from postalpincode.in
  const [selectedPincode, setSelectedPincode] = useState(null);

  const navigate = useNavigate();

  // ------------------------------------------------------------------
  // 1) FETCH ALL STATES ON COMPONENT MOUNT
  // ------------------------------------------------------------------
  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await fetch(`${UT_BASE_URL}/states/India`, {
        headers: {
          Authorization: AUTH_TOKEN,
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch states.");
      }
      const data = await response.json();
      // data might look like: [{ state_name: "Andhra Pradesh" }, ...]
      const mappedStates = data.map((item) => ({
        value: item.state_name,
        label: item.state_name,
      }));
      setStatesOptions(mappedStates);
    } catch (error) {
      console.error("Error fetching states:", error);
      setStatesOptions([]);
    }
  };

  // ------------------------------------------------------------------
  // 2) WHEN STATE IS SELECTED -> FETCH CITIES FOR THAT STATE
  // ------------------------------------------------------------------
  const handleStateSelect = async (option) => {
    setSelectedState(option);
    setFormData((prev) => ({ ...prev, state: option?.value || "" }));

    // Reset city and pincode when state changes
    setSelectedCity(null);
    setSelectedPincode(null);
    setCitiesOptions([]);
    setAvailablePincodes([]);
    setFormData((prev) => ({ ...prev, city: "", pincode: "" }));

    // Now fetch cities
    if (option) {
      try {
        const response = await fetch(`${UT_BASE_URL}/cities/${option.value}`, {
          headers: {
            Authorization: AUTH_TOKEN,
            Accept: "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch cities.");
        }
        const data = await response.json();
        // data might look like: [{ city_name: "Vijayawada" }, ...]
        const mappedCities = data.map((c) => ({
          value: c.city_name,
          label: c.city_name,
        }));
        setCitiesOptions(mappedCities);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setCitiesOptions([]);
      }
    }
  };

  // ------------------------------------------------------------------
  // 3) WHEN CITY IS SELECTED -> FETCH PINCODES FOR THAT CITY
  // ------------------------------------------------------------------
  const handleCitySelect = (option) => {
    setSelectedCity(option);
    setFormData((prev) => ({ ...prev, city: option?.value || "" }));

    // Reset pincode
    setSelectedPincode(null);
    setFormData((prev) => ({ ...prev, pincode: "" }));

    if (option) {
      fetchPincodes(option.value);
    }
  };

  const fetchPincodes = async (cityName) => {
    try {
      // For city-based search, use the postalpincode.in 'postoffice' endpoint
      const response = await fetch(
        `https://api.postalpincode.in/postoffice/${encodeURIComponent(
          cityName
        )}`
      );
      const data = await response.json();

      if (data && data[0] && data[0].Status === "Success") {
        const pincodes = data[0].PostOffice.map((office) => office.Pincode);
        const uniquePincodes = Array.from(new Set(pincodes));

        const pincodeOptions = uniquePincodes.map((pc) => ({
          value: pc,
          label: pc,
        }));
        setAvailablePincodes(pincodeOptions);
        setErrors((prev) => ({ ...prev, city: "" })); // Clear city error if any
      } else {
        setAvailablePincodes([]);
        setErrors((prev) => ({
          ...prev,
          city: "No pin codes found for this city.",
        }));
      }
    } catch (error) {
      console.error("Error fetching pin codes:", error);
      setAvailablePincodes([]);
      setErrors((prev) => ({
        ...prev,
        city: "Failed to fetch pin codes. Please try again.",
      }));
    }
  };

  // ------------------------------------------------------------------
  // 4) WHEN PINCODE IS SELECTED
  // ------------------------------------------------------------------
  const handlePincodeSelect = (option) => {
    setSelectedPincode(option);
    setFormData((prev) => ({ ...prev, pincode: option?.value || "" }));
  };

  // ------------------------------------------------------------------
  // VALIDATION
  // ------------------------------------------------------------------
  const validateFields = (fields) => {
    let newErrors = {};
    let isValid = true;

    fields.forEach((field) => {
      const value = formData[field];

      // Check if required
      if (!value) {
        newErrors[field] = "This field is required";
        isValid = false;
      }

      // Additional checks
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

  // ------------------------------------------------------------------
  // INPUT CHANGE HANDLER (For standard text fields)
  // ------------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ------------------------------------------------------------------
  // FILE UPLOAD HANDLER
  // ------------------------------------------------------------------
  const handleFileUpload = async (e, setURL, folder) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileRef = ref(storage, `${folder}/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    setURL(url);
  };

  // ------------------------------------------------------------------
  // FORM NAVIGATION
  // ------------------------------------------------------------------
  const handleNext = () => {
    const stepFields = {
      1: ["displayName", "phoneNumber"],
      2: ["email", "password"],
      3: [], // No validation for file upload
      4: ["address", "state", "city", "pincode"],
    };

    if (validateFields(stepFields[step])) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  // ------------------------------------------------------------------
  // FORM SUBMISSION
  // ------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final check
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
      const response = await fetch("http://localhost:5000/user/user-designer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

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

  // ------------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------------
  return (
    <div className="signup-container">
      <div className="signup-header">
        <div className="logo-section">
          <img src={logo} alt="Brand Logo" className="logo" />
        </div>
        <h2 className="signup-title">Sign Up</h2>
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
        {/* STEP 1: Display Name & Phone Number */}
        {step === 1 && (
          <div className="step-content">
            <div className="input-group">
              <label>Display Name</label>
              <input
                placeholder="Type here..."
                type="text"
                name="displayName"
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

        {/* STEP 2: Email & Password */}
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

        {/* STEP 3: Logo & Background Upload */}
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

        {/* STEP 4: Address, State, City, Pin Code */}
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

            {/* Select State */}
            <div className="input-group">
              <label>State</label>
              <Select
                name="state"
                value={selectedState}
                onChange={handleStateSelect}
                options={statesOptions}
                isSearchable
                placeholder="Select State"
                styles={{
                  container: (base) => ({ ...base, width: "100%" }),
                }}
              />
              {errors.state && <span className="error">{errors.state}</span>}
            </div>

            {/* Select City */}
            <div className="input-group">
              <label>City</label>
              <Select
                name="city"
                value={selectedCity}
                onChange={handleCitySelect}
                options={citiesOptions}
                isSearchable
                placeholder={
                  selectedState ? "Select City" : "Select State First"
                }
                isDisabled={!selectedState} // Only enable if state is selected
                styles={{
                  container: (base) => ({ ...base, width: "100%" }),
                }}
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>

            {/* Select Pincode */}
            <div className="input-group">
              <label>Pin Code</label>
              <Select
                name="pincode"
                value={selectedPincode}
                onChange={handlePincodeSelect}
                options={availablePincodes}
                isSearchable
                placeholder={
                  selectedCity ? "Select Pin Code" : "Select City First"
                }
                isDisabled={!selectedCity} // Only enable if city is selected
                styles={{
                  container: (base) => ({ ...base, width: "100%" }),
                }}
              />
              {errors.pincode && (
                <span className="error">{errors.pincode}</span>
              )}
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
