import { SignupFormData, SignUpResponse } from "@types";
import { supabaseClient } from "./supabase-client-service";

export const signUp = async (
  payload: SignupFormData
): Promise<SignUpResponse> => {
  try {
    const {
      data: { user, session },
      error,
    } = await supabaseClient.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          username: payload.firstName + " " + payload.lastName,
        },
      },
    });

    if (error) {
      return {
        user: null,
        session: null,
        error: error.message,
      };
    }

    return {
      user,
      session,
      error: null,
    };
  } catch (err) {
    return {
      user: null,
      session: null,
      error:
        err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
};
