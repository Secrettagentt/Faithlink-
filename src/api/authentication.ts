import axios, { AxiosResponse } from "axios";

interface AuthenticationResponse {
  [key: string]: any;
}

export async function Authentication(): Promise<
  AuthenticationResponse | string
> {
  try {
    const response: AxiosResponse<AuthenticationResponse> = await axios.get(
      "/api/authentication"
    );
    if (!response.data) {
      return "Authentication failed";
    }
    return response.data;
  } catch (e) {
    return { message: "Unable to authenticate" };
  }
}
