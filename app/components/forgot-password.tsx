import { Auth } from "aws-amplify";
import { useState } from "react";
import Locale from "../locales";
import { AuthMode, useAuthStore } from "../store/auth";
import styles from "./authenticator.module.scss";
import { IconButton } from "./button";
import { Modal, showToast } from "./ui-lib";

export function ForgotPasswordModal() {
  const authStore = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);

  const forgotPassword = async () => {
    try {
      setErrorMessage("");
      await Auth.forgotPassword(email);
      setVerificationCodeSent(true);
      setErrorMessage(Locale.Auth.CheckEmailForCode);
    } catch (error) {
      setErrorMessage(`${error}`);
    }
  };

  const confirmForgotPassword = async () => {
    try {
      setErrorMessage("");
      await Auth.forgotPasswordSubmit(email, verificationCode, password);
      authStore.setAuthMode(AuthMode.SIGN_IN);
      showToast(Locale.Auth.ResetPasswordSuccess);
    } catch (error) {
      setErrorMessage(`${error}`);
    }
  };

  return (
    <Modal
      title={Locale.Auth.ResetPassword}
      onClose={authStore.closeAuthModal}
      actions={[
        <IconButton
          key="forgot password"
          onClick={
            verificationCodeSent ? confirmForgotPassword : forgotPassword
          }
          text={
            verificationCodeSent
              ? Locale.Auth.ConfirmCode
              : Locale.Auth.ResetPassword
          }
          bordered
        />,
      ]}
    >
      <div className={styles["auth-container"]}>
        <form className={styles["auth-form"]}>
          <label htmlFor="email" className={styles["auth-label"]}>
            {Locale.Auth.Email}
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles["auth-input"]}
            required
            autoComplete="email"
            placeholder={Locale.Auth.EnterEmail}
          />
          {verificationCodeSent && (
            <>
              <label
                htmlFor="verificationCode"
                className={styles["auth-label"]}
              >
                {Locale.Auth.VerificationCode}
              </label>
              <input
                id="verificationCode"
                name="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className={styles["auth-input"]}
                placeholder={Locale.Auth.EnterVerificationCode}
                required
              />
              <label htmlFor="password" className={styles["auth-label"]}>
                {Locale.Auth.Password}
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles["auth-input"]}
                autoComplete="current-password"
                placeholder={Locale.Auth.EnterPassword}
                required
              />
            </>
          )}
          {errorMessage && (
            <div className={styles["error-message"]}>{errorMessage}</div>
          )}
        </form>
      </div>
    </Modal>
  );
}
