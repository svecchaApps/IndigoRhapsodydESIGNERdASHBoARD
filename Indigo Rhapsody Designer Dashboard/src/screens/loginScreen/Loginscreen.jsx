import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  LoginScreenWrap,
  LeftSection,
  RightSection,
  FormContainer,
  InfoContainer,
} from "./LoginsScreen.styles";
import { FaGoogle } from "react-icons/fa";
import { loginDesigner } from "../../service/authService";

function Loginscreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginDesigner(email, password);

      localStorage.setItem("userId", response.userId);
      localStorage.setItem("designerId", response.designerId);

      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginScreenWrap>
      <LeftSection>
        <FormContainer>
          <h1>Welcome Back!</h1>
          <p>
            Ofative empowers you to manage, enhance, and safeguard your day,
            putting you in control of your schedule.
          </p>
          <form onSubmit={handleLogin}>
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
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Sign in"}
            </button>
            <div className="separator">or</div>
            <button type="button" className="google-login-btn">
              <FaGoogle /> Sign in with Google
            </button>
            <p className="signup-link">
              Don't have an account? <a href="/signup">Sign up</a>
            </p>
          </form>
        </FormContainer>
      </LeftSection>
      <RightSection>
        <InfoContainer>
          <h2>Redefine Your Calendar Experience!</h2>
          <p>
            Unshackle yourself from the confines of traditional scheduling and
            immerse yourself in the boundless convenience that Ofative brings to
            your daily routine.
          </p>
        </InfoContainer>
      </RightSection>
    </LoginScreenWrap>
  );
}

export default Loginscreen;
