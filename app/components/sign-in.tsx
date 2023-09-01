import { Auth } from "aws-amplify";
import { useState } from "react";
import Locale from "../locales";
import { AuthMode, useAuthStore } from "../store/auth";
import styles from "./authenticator.module.scss";
import { IconButton } from "./button";
import { Modal, showToast } from "./ui-lib";

export function SignInModal() {
  const authStore = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const signIn = async () => {
    try {
      setErrorMessage("");
      await Auth.signIn(email, password);
      showToast(Locale.Auth.SignInSuccess);
    } catch (error) {
      setErrorMessage(`${error}`);
    }
  };

  return (
    <Modal
      title={Locale.Auth.SignIn}
      onClose={authStore.closeAuthModal}
      actions={[
        <IconButton
          key="sign in"
          onClick={signIn}
          text={Locale.Auth.SignIn}
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
            autoComplete="email"
            placeholder={Locale.Auth.EnterEmail}
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
          <a
            onClick={() => authStore.setAuthMode(AuthMode.FORGOT_PASSWORD)}
            className={styles["forgot-password"]}
          >
            {Locale.Auth.ForgotPassword}
          </a>
          <div className={styles["divider"]} />
          <div>
            {Locale.Auth.NeedAccount}{" "}
            <a
              onClick={() => authStore.setAuthMode(AuthMode.SIGN_UP)}
              className={styles["anchor"]}
            >
              {Locale.Auth.SignUp}
            </a>
          </div>
          {errorMessage && (
            <div className={styles["error-message"]}>{errorMessage}</div>
          )}
        </form>
      </div>
    </Modal>
  );
}
