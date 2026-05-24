import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import {
  FaEye,
  FaEyeSlash,
  FaCloudUploadAlt,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { storage } from "../../service/firebaseService";
import { getApiBaseUrl } from "../../config/environment";
import logo from "../../assets/images/Asset_3.webp";
import {
  SignUpScreenWrap,
  BackgroundOrbs,
  SignUpLayout,
  SidePanel,
  BrandBlock,
  StepList,
  StepItem,
  StepCircle,
  StepMeta,
  FormPanel,
  FormCard,
  StepHeader,
  FormGrid,
  FieldGroup,
  PasswordField,
  FieldError,
  UploadZone,
  FormActions,
  PrimaryButton,
  SecondaryButton,
  LoginPrompt,
  ModalOverlay,
  ModalCard,
  PincodeHint,
} from "./SignUpScreen.styles";

const STEPS = [
  {
    id: 1,
    label: "Profile",
    hint: "Name & contact",
    title: "Your designer profile",
    subtitle: "How customers will know you on Indigo Rhapsody.",
  },
  {
    id: 2,
    label: "Account",
    hint: "Email & password",
    title: "Secure your account",
    subtitle: "Use these credentials to access your designer dashboard.",
  },
  {
    id: 3,
    label: "Brand",
    hint: "Images & bio",
    title: "Showcase your brand",
    subtitle: "Add visuals and a short story that represent your work.",
  },
  {
    id: 4,
    label: "Address",
    hint: "Shipping details",
    title: "Business address",
    subtitle: "Used for orders and logistics across India.",
  },
];

const stepFields = {
  1: ["displayName", "phoneNumber"],
  2: ["email", "password"],
  3: ["logoUrl", "backgroundImageUrl"],
  4: ["address", "pincode", "city", "state"],
};

function SignupScreen() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    displayName: "",
    phoneNumber: "",
    email: "",
    password: "",
    is_creator: true,
    shortDescription: "",
    about: "",
    role: "Designer",
    logoUrl: "",
    backgroundImageUrl: "",
    addressNickname: "Home",
    address: "",
    pincode: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [uploading, setUploading] = useState({ logoUrl: false, backgroundImageUrl: false });

  const navigate = useNavigate();
  const currentStep = STEPS[step - 1];

  const validateFields = (fields) => {
    const newErrors = { ...errors };
    let isValid = true;

    fields.forEach((field) => {
      delete newErrors[field];
    });

    fields.forEach((field) => {
      const value = formData[field];

      if (!value) {
        newErrors[field] = "This field is required";
        isValid = false;
      }

      if (field === "phoneNumber" && value) {
        const phoneRegex = /^\+91\d{10}$/;
        if (!phoneRegex.test(value)) {
          newErrors.phoneNumber =
            "Use format +91 followed by 10 digits (e.g. +919876543210)";
          isValid = false;
        }
      }

      if (field === "pincode" && value) {
        const pincodeRegex = /^\d{6}$/;
        if (!pincodeRegex.test(value)) {
          newErrors.pincode = "Pin code must be exactly 6 digits";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "email") {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (value && !emailPattern.test(value)) {
        newErrors.email = "Please enter a valid email address";
      } else {
        delete newErrors.email;
      }
    }

    if (name === "password") {
      if (value && value.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      } else {
        delete newErrors.password;
      }
    }

    if (name === "pincode") {
      setFormData((prev) => ({ ...prev, city: "", state: "" }));

      if (value.length === 6) {
        setPincodeLoading(true);
        try {
          const response = await fetch(
            `https://api.postalpincode.in/pincode/${value}`
          );
          const data = await response.json();

          if (data?.[0]?.Status === "Success") {
            const postOfficeInfo = data[0].PostOffice?.[0];
            if (postOfficeInfo) {
              setFormData((prev) => ({
                ...prev,
                city: postOfficeInfo.District || "",
                state: postOfficeInfo.State || "",
              }));
            }
          }
        } catch (error) {
          console.error("Error fetching pincode details:", error);
        } finally {
          setPincodeLoading(false);
        }
      }
    }

    setErrors(newErrors);
  };

  const handleFileUpload = async (e, fieldName, folder) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newErrors = { ...errors };
    setUploading((prev) => ({ ...prev, [fieldName]: true }));

    try {
      const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      setFormData((prev) => ({ ...prev, [fieldName]: url }));
      delete newErrors[fieldName];
      setErrors(newErrors);
    } catch (error) {
      console.error("File upload error:", error);
      newErrors[fieldName] = "Upload failed. Please try again.";
      setErrors(newErrors);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleNext = () => {
    if (validateFields(stepFields[step])) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields(stepFields[4])) {
      return;
    }

    const finalAddress = [
      {
        nick_name: formData.addressNickname || "Home",
        street_details: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: parseInt(formData.pincode, 10),
      },
    ];

    const requestBody = {
      email: formData.email,
      password: formData.password,
      displayName: formData.displayName,
      phoneNumber: formData.phoneNumber,
      role: formData.role || "Designer",
      is_creator: formData.is_creator,
      shortDescription: formData.shortDescription || "Default short desc",
      about: formData.about || "Default about text",
      logoUrl: formData.logoUrl,
      backgroundImageUrl: formData.backgroundImageUrl,
      address: finalAddress,
    };

    setSubmitting(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/user/user-designer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setShowModal(true);
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Sign-up failed. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = () => {
    navigate("/");
  };

  const renderUpload = (fieldName, folder, label, hint) => (
    <FieldGroup>
      <label>{label}</label>
      <UploadZone $hasFile={Boolean(formData[fieldName])}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, fieldName, folder)}
          disabled={uploading[fieldName]}
        />
        {formData[fieldName] ? (
          <img src={formData[fieldName]} alt="" className="preview" />
        ) : (
          <FaCloudUploadAlt />
        )}
        <strong>
          {uploading[fieldName]
            ? "Uploading…"
            : formData[fieldName]
              ? "Change image"
              : "Click to upload"}
        </strong>
        <span>{hint}</span>
      </UploadZone>
      {errors[fieldName] && <FieldError>{errors[fieldName]}</FieldError>}
    </FieldGroup>
  );

  return (
    <SignUpScreenWrap>
      <BackgroundOrbs />
      <SignUpLayout>
        <SidePanel>
          <BrandBlock>
            <img src={logo} alt="Indigo Rhapsody" />
            <h1>Join as a Designer</h1>
            <p>
              Create your account and start selling on Indigo Rhapsody — India&apos;s
              curated fashion marketplace.
            </p>
          </BrandBlock>

          <StepList>
            {STEPS.map((s) => (
              <StepItem
                key={s.id}
                $active={step === s.id}
                $completed={step > s.id}
              >
                <StepCircle $active={step === s.id} $completed={step > s.id}>
                  {step > s.id ? <FaCheck size={12} /> : s.id}
                </StepCircle>
                <StepMeta>
                  <strong>{s.label}</strong>
                  <span>{s.hint}</span>
                </StepMeta>
              </StepItem>
            ))}
          </StepList>
        </SidePanel>

        <FormPanel>
          <FormCard>
            <StepHeader>
              <h2>{currentStep.title}</h2>
              <p>{currentStep.subtitle}</p>
            </StepHeader>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <FormGrid>
                  <FieldGroup>
                    <label htmlFor="displayName">Display name</label>
                    <input
                      id="displayName"
                      type="text"
                      name="displayName"
                      placeholder="Your brand or studio name"
                      value={formData.displayName}
                      onChange={handleInputChange}
                    />
                    {errors.displayName && (
                      <FieldError>{errors.displayName}</FieldError>
                    )}
                  </FieldGroup>
                  <FieldGroup>
                    <label htmlFor="phoneNumber">Phone number</label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      name="phoneNumber"
                      placeholder="+919876543210"
                      maxLength={13}
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                    {errors.phoneNumber && (
                      <FieldError>{errors.phoneNumber}</FieldError>
                    )}
                  </FieldGroup>
                </FormGrid>
              )}

              {step === 2 && (
                <FormGrid>
                  <FieldGroup>
                    <label htmlFor="email">Email address</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="email"
                    />
                    {errors.email && <FieldError>{errors.email}</FieldError>}
                  </FieldGroup>
                  <FieldGroup>
                    <label htmlFor="password">Password</label>
                    <PasswordField>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="At least 6 characters"
                        value={formData.password}
                        onChange={handleInputChange}
                        autoComplete="new-password"
                      />
                      <span
                        className="eye-icon"
                        onClick={() => setShowPassword(!showPassword)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) =>
                          e.key === "Enter" && setShowPassword(!showPassword)
                        }
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </PasswordField>
                    {errors.password && (
                      <FieldError>{errors.password}</FieldError>
                    )}
                  </FieldGroup>
                </FormGrid>
              )}

              {step === 3 && (
                <FormGrid>
                  <FieldGroup>
                    <label htmlFor="shortDescription">Short description</label>
                    <input
                      id="shortDescription"
                      type="text"
                      name="shortDescription"
                      placeholder="A one-line tagline for your brand"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <label htmlFor="about">About you</label>
                    <textarea
                      id="about"
                      name="about"
                      placeholder="Tell shoppers about your design philosophy and collections"
                      value={formData.about}
                      onChange={handleInputChange}
                    />
                  </FieldGroup>
                  {renderUpload(
                    "logoUrl",
                    "logos",
                    "Brand logo",
                    "Square image works best · PNG or JPG"
                  )}
                  {renderUpload(
                    "backgroundImageUrl",
                    "backgrounds",
                    "Cover image",
                    "Wide banner for your storefront · PNG or JPG"
                  )}
                </FormGrid>
              )}

              {step === 4 && (
                <>
                  <FormGrid $twoCol>
                    <FieldGroup>
                      <label htmlFor="pincode">Pin code</label>
                      <input
                        id="pincode"
                        type="text"
                        name="pincode"
                        placeholder="6-digit PIN"
                        maxLength={6}
                        value={formData.pincode}
                        onChange={handleInputChange}
                      />
                      {pincodeLoading && (
                        <PincodeHint>Looking up city & state…</PincodeHint>
                      )}
                      {errors.pincode && (
                        <FieldError>{errors.pincode}</FieldError>
                      )}
                    </FieldGroup>
                    <FieldGroup>
                      <label htmlFor="addressNickname">Address label</label>
                      <input
                        id="addressNickname"
                        type="text"
                        name="addressNickname"
                        placeholder="Home, Studio, Warehouse…"
                        value={formData.addressNickname}
                        onChange={handleInputChange}
                      />
                    </FieldGroup>
                  </FormGrid>
                  <FormGrid>
                    <FieldGroup>
                      <label htmlFor="address">Street address</label>
                      <input
                        id="address"
                        type="text"
                        name="address"
                        placeholder="Building, street, locality"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                      {errors.address && (
                        <FieldError>{errors.address}</FieldError>
                      )}
                    </FieldGroup>
                  </FormGrid>
                  <FormGrid $twoCol>
                    <FieldGroup>
                      <label htmlFor="city">City</label>
                      <input
                        id="city"
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={pincodeLoading}
                      />
                      {errors.city && <FieldError>{errors.city}</FieldError>}
                    </FieldGroup>
                    <FieldGroup>
                      <label htmlFor="state">State</label>
                      <input
                        id="state"
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleInputChange}
                        disabled={pincodeLoading}
                      />
                      {errors.state && <FieldError>{errors.state}</FieldError>}
                    </FieldGroup>
                  </FormGrid>
                </>
              )}

              <FormActions>
                {step > 1 && (
                  <SecondaryButton type="button" onClick={handleBack}>
                    <FaArrowLeft />
                    Back
                  </SecondaryButton>
                )}
                {step < 4 ? (
                  <PrimaryButton type="button" onClick={handleNext}>
                    Continue
                    <FaArrowRight />
                  </PrimaryButton>
                ) : (
                  <PrimaryButton type="submit" disabled={submitting}>
                    {submitting ? "Creating account…" : "Create account"}
                  </PrimaryButton>
                )}
              </FormActions>
            </form>

            <LoginPrompt>
              Already have an account? <Link to="/">Sign in</Link>
            </LoginPrompt>
          </FormCard>
        </FormPanel>
      </SignUpLayout>

      {showModal && (
        <ModalOverlay>
          <ModalCard>
            <div className="success-icon">
              <FaCheck />
            </div>
            <h3>Welcome aboard!</h3>
            <p>
              Your designer account has been created. Sign in to access your
              dashboard and start listing products.
            </p>
            <PrimaryButton type="button" onClick={handleContinue}>
              Go to sign in
            </PrimaryButton>
          </ModalCard>
        </ModalOverlay>
      )}
    </SignUpScreenWrap>
  );
}

export default SignupScreen;
