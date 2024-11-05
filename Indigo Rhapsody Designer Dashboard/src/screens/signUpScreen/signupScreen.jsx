import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  SignUpScreenWrap,
  LeftSection,
  RightSection,
  FormContainer,
  InfoContainer,
} from "./signupscreen.styles";
import { FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";
import { storage } from "../../service/firebaseService"; // Import your Firebase configuration
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const SignUpScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [about, setAbout] = useState("");
  const [password, setPassword] = useState("");
  const [logo, setLogo] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const navigate = useNavigate();

  const handleImageUpload = async (file, folderName, setUrl) => {
    if (!file) return;

    const storageRef = ref(storage, `${folderName}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress handling can be added here
      },
      (error) => {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image.");
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setUrl(url);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload images and wait for their URLs
    await handleImageUpload(logo, "logos", setLogoUrl);
    await handleImageUpload(
      backgroundImage,
      "backgrounds",
      setBackgroundImageUrl
    );

    // Proceed to API call after image URLs are set
    if (logoUrl && backgroundImageUrl) {
      const signupData = {
        email,
        password,
        displayName: name,
        phoneNumber,
        role,
        address,
        city,
        state,
        pincode,
        is_creator: false,
        shortDescription,
        about,
        logoUrl,
        backgroundImageUrl,
      };

      // Call the API here to send `signupData`
      // Example: await api.post("/signup", signupData);

      toast.success("Signup successful!");
      navigate("/thank-you");
    } else {
      toast.error("Please wait for image upload to complete.");
    }
  };

  return (
    <SignUpScreenWrap>
      <LeftSection>
        <FormContainer>
          <h1>Welcome to Indigo Rhapsody</h1>
          <p>Join us and start selling with just a few clicks.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter your username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            {/* <div className="form-group">
              <input
                type="text"
                placeholder="Enter your role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div> */}
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter your state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="digit"
                placeholder="Enter your pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Short description about you"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Tell us more about yourself"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Upload Logo:</label>
              <input
                type="file"
                onChange={(e) => setLogo(e.target.files[0])}
                required
              />
            </div>
            <div className="form-group">
              <label>Upload Background Image:</label>
              <input
                type="file"
                onChange={(e) => setBackgroundImage(e.target.files[0])}
                required
              />
            </div>
            <button type="submit" className="signup-btn">
              Register
            </button>
            <div className="separator">or</div>
            {/* <button type="button" className="google-signup-btn">
              <FaGoogle /> Register with Google
            </button> */}
            <p className="login-link">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </form>
        </FormContainer>
      </LeftSection>
      <RightSection>
        <InfoContainer>
          <h2>Revolutionize Your Schedule with Ease!</h2>
          <p>
            Customize events to suit your preferences. Add details, prioritize,
            and color-code — because your calendar should adapt to your unique
            style.
          </p>
        </InfoContainer>
      </RightSection>
    </SignUpScreenWrap>
  );
};

export default SignUpScreen;
