import { Auth } from "aws-amplify";

export async function getIdToken(): Promise<string> {
  try {
    const session = await Auth.currentSession();
    const idToken = session.getIdToken().getJwtToken();
    return idToken;
  } catch (error) {
    console.error("Error getting ID token:", error);
    return "";
  }
}
