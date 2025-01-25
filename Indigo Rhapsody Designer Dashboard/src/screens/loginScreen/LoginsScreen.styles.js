import styled from "styled-components";

export const LoginScreenWrap = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f4f7fc;
`;

export const LeftSection = styled.div`
  flex: 1;
  background: linear-gradient(270deg, #fff 0%, rgba(255, 255, 255, 0.07) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  position: relative; /* Important for pseudo-elements positioning */

  &::before {
    content: "";
    position: absolute;
    top: 10%;
    left: 15%;
    width: 200px;
    height: 200px;
    background: rgba(106, 17, 203, 0.5);
    filter: blur(100px);
    border-radius: 50%;
    z-index: 0;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 20%;
    right: 10%;
    width: 300px;
    height: 300px;
    background: rgba(119, 151, 255, 0.9);
    filter: blur(150px);
    border-radius: 50%;
    z-index: 0;
  }

  @media (max-width: 768px) {
    flex: 1;
  }
`;
export const RightSection = styled.div`
  flex: 1;
  background: linear-gradient(270deg, #fff 0%, rgba(255, 255, 255, 0.07) 100%);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  position: relative; /* Important for pseudo-elements positioning */

  &::before {
    content: "";
    position: absolute;
    top: 10%;
    left: 15%;
    width: 200px;
    height: 200px;
    background: rgba(106, 17, 203, 0.5);
    filter: blur(100px);
    border-radius: 50%;
    z-index: 0;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 20%;
    right: 10%;
    width: 300px;
    height: 300px;
    background: rgba(119, 151, 255, 0.9);
    filter: blur(150px);
    border-radius: 50%;
    z-index: 0;
  }

  @media (max-width: 768px) {
    display: none; /* Hide for smaller screens */
  }
`;

export const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  text-align: center;
  .logo-section {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 24px;
  }

  .logo {
    width: 200px; /* Adjust the width */
    height: auto; /* Maintain aspect ratio */
  }

  h1 {
    font-size: 28px;
    margin-bottom: 16px;
    color: #2c2c2c;
  }

  p {
    font-size: 14px;
    margin-bottom: 24px;
    color: #555;
  }

  .form-group {
    margin-bottom: 16px;

    input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #ccc;
      border-radius: 20px;
      font-size: 14px;
      outline: none;

      &:focus {
      border: 1px solid rgb(15, 57, 209);
        border-color:rgb(15, 57, 209);
      }
    }
  }

  .login-btn {
    width: 100%;
    padding: 12px 16px;
    background-color: ${(props) => props.theme.colors.blue};
    color: #fff;
    border: none;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    margin-bottom: 16px;
  }

  .separator {
    margin: 16px 0;
    font-size: 12px;
    color: #aaa;
  }

  .google-login-btn {
    width: 100%;
    padding: 12px 16px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
    margin-bottom: 16px;

    svg {
      margin-right: 8px;
    }
  }

  .signup-link {
    margin-top: 16px;
    font-size: 14px;

    a {
      color: ${(props) => props.theme.colors.blue};
      text-decoration: none;
    }
  }
`;

export const InfoContainer = styled.div`
  text-align: left;
  max-width: 400px;

  h2 {
    font-size: 32px;
    margin-bottom: 16px;
  }

  p {
    font-size: 16px;
    line-height: 1.5;
  }
`;
