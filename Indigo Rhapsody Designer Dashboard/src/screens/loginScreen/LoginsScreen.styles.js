import styled from "styled-components";

export const LoginScreenWrap = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f4f7fc;
`;

export const LeftSection = styled.div`
  flex: 1;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;

  @media (max-width: 768px) {
    flex: 1;
  }
`;

export const RightSection = styled.div`
  flex: 1;
  background-color: ${(props) => props.theme.colors.blue};
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;

  @media (max-width: 768px) {
    display: none; /* Hide for smaller screens */
  }
`;

export const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  text-align: center;

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
      border-radius: 4px;
      font-size: 14px;
      outline: none;

      &:focus {
        border-color: #2c54ea;
      }
    }
  }

  .login-btn {
    width: 100%;
    padding: 12px 16px;
    background-color: ${(props) => props.theme.colors.blue};
    color: #fff;
    border: none;
    border-radius: 4px;
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
