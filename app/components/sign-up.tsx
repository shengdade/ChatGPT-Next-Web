import { Auth } from "aws-amplify";
import { useState } from "react";
import Locale from "../locales";
import { AuthMode, useAuthStore } from "../store/auth";
import styles from "./authenticator.module.scss";
import { IconButton } from "./button";
import { Modal, showToast } from "./ui-lib";

export function SignUpModal() {
  const authStore = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);

  const signUp = async () => {
    try {
      setErrorMessage("");
      await Auth.signUp({
        username: email,
        password,
        autoSignIn: { enabled: true },
      });
      setVerificationCodeSent(true);
      setErrorMessage(Locale.Auth.CheckEmailForCode);
    } catch (error) {
      setErrorMessage(`${error}`);
    }
  };

  const confirmSignUp = async () => {
    try {
      setErrorMessage("");
      await Auth.confirmSignUp(email, verificationCode);
      showToast(Locale.Auth.SignUpSuccess);
    } catch (error) {
      setErrorMessage(`${error}`);
    }
  };

  const resendConfirmationCode = async () => {
    try {
      setErrorMessage("");
      await Auth.resendSignUp(email);
      setErrorMessage(Locale.Auth.CheckEmailForCode);
    } catch (error) {
      setErrorMessage(`${error}`);
    }
  };

  return (
    <Modal
      title={Locale.Auth.SignUp}
      onClose={authStore.closeAuthModal}
      actions={[
        <IconButton
          key="resend code"
          onClick={resendConfirmationCode}
          text={Locale.Auth.ResendCode}
          bordered
        />,
        <IconButton
          key="sign up"
          onClick={verificationCodeSent ? confirmSignUp : signUp}
          text={
            verificationCodeSent ? Locale.Auth.ConfirmCode : Locale.Auth.SignUp
          }
          bordered
        />,
      ].slice(verificationCodeSent ? 0 : 1, 2)}
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
          {verificationCodeSent ? (
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
            </>
          ) : (
            <>
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
              <div className={styles["divider"]} />
              <div>
                {Locale.Auth.HaveAccount}{" "}
                <a
                  onClick={() => authStore.setAuthMode(AuthMode.SIGN_IN)}
                  className={styles["anchor"]}
                >
                  {Locale.Auth.SignIn}
                </a>
              </div>
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
