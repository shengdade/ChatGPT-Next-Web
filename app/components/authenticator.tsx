import { HubCapsule } from "@aws-amplify/core";
import { Amplify, Auth, Hub } from "aws-amplify";
import { useEffect } from "react";
import { COGNITO_USER_POOL_CLIENT_ID, COGNITO_USER_POOL_ID } from "../aws";
import { AuthMode, useAuthStore } from "../store/auth";
import { ForgotPasswordModal } from "./forgot-password";
import { SignInModal } from "./sign-in";
import { SignUpModal } from "./sign-up";

Amplify.configure({
  Auth: {
    userPoolId: COGNITO_USER_POOL_ID,
    userPoolWebClientId: COGNITO_USER_POOL_CLIENT_ID,
  },
});

export function Authenticator() {
  const authStore = useAuthStore();

  useEffect(() => {
    const checkCurrentAuthenticatedUser = async () => {
      try {
        await Auth.currentAuthenticatedUser();
        authStore.setAuthorized();
      } catch (error) {
        console.log("No user is currently authenticated");
      }
    };

    checkCurrentAuthenticatedUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleAuthEvent = (event: HubCapsule) => {
      const { payload } = event;

      switch (payload.event) {
        case "signIn":
          authStore.setAuthorized();
          authStore.closeAuthModal();
          break;
        case "signOut":
          authStore.setUnauthorized();
          break;
      }
    };
    const removeListener = Hub.listen("auth", handleAuthEvent);
    return () => {
      removeListener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ visibility: authStore.showAuthModal ? "visible" : "hidden" }}>
      <div className="modal-mask">
        {authStore.authMode === AuthMode.SIGN_IN && <SignInModal />}
        {authStore.authMode === AuthMode.SIGN_UP && <SignUpModal />}
        {authStore.authMode === AuthMode.FORGOT_PASSWORD && (
          <ForgotPasswordModal />
        )}
      </div>
    </div>
  );
}
