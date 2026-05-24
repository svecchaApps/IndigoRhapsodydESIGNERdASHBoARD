import styled, { css } from "styled-components";
import { media } from "../../styles/theme/theme";

export const SignUpScreenWrap = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.seasalt};
  font-family: ${(props) => props.theme.typography.fontFamily};
`;

export const SignUpLayout = styled.div`
  display: flex;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px;
  gap: 48px;
  align-items: flex-start;
  position: relative;
  z-index: 1;

  ${media.md(css`
    flex-direction: column;
    gap: 24px;
    padding: 24px 16px;
  `)}
`;

export const BackgroundOrbs = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;

  &::before {
    content: "";
    position: absolute;
    top: 8%;
    left: 12%;
    width: 220px;
    height: 220px;
    background: rgba(167, 0, 255, 0.35);
    filter: blur(100px);
    border-radius: 50%;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 15%;
    right: 8%;
    width: 280px;
    height: 280px;
    background: rgba(93, 95, 239, 0.45);
    filter: blur(120px);
    border-radius: 50%;
  }
`;

export const SidePanel = styled.aside`
  flex: 0 0 280px;
  position: sticky;
  top: 32px;

  ${media.md(css`
    flex: none;
    width: 100%;
    position: static;
  `)}
`;

export const BrandBlock = styled.div`
  margin-bottom: 32px;

  img {
    width: 160px;
    height: auto;
    margin-bottom: 16px;
  }

  h1 {
    font-size: 26px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.cadet};
    margin: 0 0 8px;
    line-height: 1.3;
  }

  p {
    font-size: 14px;
    color: ${(props) => props.theme.colors.gray700};
    margin: 0;
    line-height: 1.5;
  }
`;

export const StepList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;

  ${media.md(css`
    flex-direction: row;
    justify-content: space-between;
    gap: 8px;
  `)}
`;

export const StepItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 0;
  position: relative;
  color: ${(props) => props.theme.colors.gray700};
  transition: color 0.2s ease;

  ${(props) =>
    props.$active &&
    css`
      color: ${props.theme.colors.cadet};
    `}

  ${(props) =>
    props.$completed &&
    css`
      color: ${props.theme.colors.cadet};
    `}

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    left: 15px;
    top: 48px;
    width: 2px;
    height: calc(100% - 24px);
    background: ${(props) =>
      props.$completed || props.$active
        ? props.theme.colors.blue
        : props.theme.colors.columbiaBlue};
    transition: background 0.2s ease;
  }

  ${media.md(css`
    flex: 1;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0;

    &:not(:last-child)::after {
      display: none;
    }
  `)}
`;

export const StepCircle = styled.span`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  border: 2px solid ${(props) => props.theme.colors.columbiaBlue};
  background: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.gray700};
  transition: all 0.2s ease;

  ${(props) =>
    (props.$active || props.$completed) &&
    css`
      border-color: ${props.theme.colors.blue};
      background: ${props.theme.colors.blue};
      color: ${props.theme.colors.white};
    `}
`;

export const StepMeta = styled.div`
  padding-top: 4px;

  strong {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 2px;
  }

  span {
    font-size: 12px;
    opacity: 0.85;
  }

  ${media.md(css`
    strong {
      font-size: 11px;
    }
    span {
      display: none;
    }
  `)}
`;

export const FormPanel = styled.main`
  flex: 1;
  min-width: 0;
`;

export const FormCard = styled.div`
  background: ${(props) => props.theme.colors.white};
  border-radius: 20px;
  padding: 36px 40px;
  box-shadow: 0 4px 24px rgba(21, 29, 72, 0.06);
  border: 1px solid rgba(195, 211, 226, 0.5);

  ${media.md(css`
    padding: 24px 20px;
  `)}
`;

export const StepHeader = styled.div`
  margin-bottom: 28px;

  h2 {
    font-size: 22px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.cadet};
    margin: 0 0 6px;
  }

  p {
    font-size: 14px;
    color: ${(props) => props.theme.colors.gray700};
    margin: 0;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  gap: 20px;

  & + & {
    margin-top: 20px;
  }

  ${(props) =>
    props.$twoCol &&
    css`
      grid-template-columns: 1fr 1fr;

      ${media.md(css`
        grid-template-columns: 1fr;
      `)}
    `}
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 13px;
    font-weight: 500;
    color: ${(props) => props.theme.colors.cadet};
  }

  input,
  textarea {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid ${(props) => props.theme.colors.columbiaBlue};
    border-radius: 12px;
    font-size: 14px;
    font-family: inherit;
    color: ${(props) => props.theme.colors.cadet};
    background: ${(props) => props.theme.colors.white};
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &::placeholder {
      color: ${(props) => props.theme.colors.frenchGray};
    }

    &:focus {
      border-color: ${(props) => props.theme.colors.blue};
      box-shadow: 0 0 0 3px rgba(93, 95, 239, 0.12);
    }

    &:disabled {
      background: ${(props) => props.theme.colors.seasalt};
      cursor: not-allowed;
    }
  }

  textarea {
    min-height: 88px;
    resize: vertical;
  }
`;

export const PasswordField = styled.div`
  position: relative;

  input {
    padding-right: 44px;
  }

  .eye-icon {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: ${(props) => props.theme.colors.gray700};
    font-size: 1.1rem;
    display: flex;
    align-items: center;
  }
`;

export const FieldError = styled.span`
  font-size: 12px;
  color: ${(props) => props.theme.colors.red};
`;

export const UploadZone = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 120px;
  padding: 20px;
  border: 2px dashed
    ${(props) =>
      props.$hasFile ? props.theme.colors.blue : props.theme.colors.columbiaBlue};
  border-radius: 12px;
  background: ${(props) =>
    props.$hasFile ? props.theme.colors.aliceBlue : props.theme.colors.seasalt};
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
  text-align: center;

  &:hover {
    border-color: ${(props) => props.theme.colors.blue};
    background: ${(props) => props.theme.colors.aliceBlue};
  }

  input {
    display: none;
  }

  svg {
    font-size: 28px;
    color: ${(props) => props.theme.colors.blue};
  }

  strong {
    font-size: 14px;
    color: ${(props) => props.theme.colors.cadet};
  }

  span {
    font-size: 12px;
    color: ${(props) => props.theme.colors.gray700};
  }

  img.preview {
    max-width: 100%;
    max-height: 80px;
    border-radius: 8px;
    object-fit: contain;
  }
`;

export const FormActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid ${(props) => props.theme.colors.seasalt};

  ${media.md(css`
    flex-direction: column-reverse;
  `)}
`;

const buttonBase = css`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.15s ease;
  border: none;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:not(:disabled):active {
    transform: scale(0.98);
  }
`;

export const PrimaryButton = styled.button`
  ${buttonBase}
  background: ${(props) => props.theme.colors.blue};
  color: ${(props) => props.theme.colors.white};

  &:not(:disabled):hover {
    opacity: 0.92;
  }
`;

export const SecondaryButton = styled.button`
  ${buttonBase}
  flex: 0 0 auto;
  min-width: 100px;
  background: ${(props) => props.theme.colors.seasalt};
  color: ${(props) => props.theme.colors.cadet};
  border: 1px solid ${(props) => props.theme.colors.columbiaBlue};

  &:not(:disabled):hover {
    background: ${(props) => props.theme.colors.aliceBlue};
  }
`;

export const LoginPrompt = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: ${(props) => props.theme.colors.gray700};

  a {
    color: ${(props) => props.theme.colors.blue};
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(21, 29, 72, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;
  backdrop-filter: blur(4px);
`;

export const ModalCard = styled.div`
  background: ${(props) => props.theme.colors.white};
  border-radius: 20px;
  padding: 40px 36px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(21, 29, 72, 0.15);

  .success-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px;
    border-radius: 50%;
    background: ${(props) => props.theme.colors.nyanza};
    color: ${(props) => props.theme.colors.malachite};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
  }

  h3 {
    font-size: 22px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.cadet};
    margin: 0 0 10px;
  }

  p {
    font-size: 14px;
    color: ${(props) => props.theme.colors.gray700};
    margin: 0 0 24px;
    line-height: 1.5;
  }

  button {
    width: 100%;
  }
`;

export const PincodeHint = styled.span`
  font-size: 12px;
  color: ${(props) => props.theme.colors.gray700};
  font-style: italic;
`;
