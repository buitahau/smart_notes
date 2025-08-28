import { SignupFormData, SignUpResponse } from '@types/signup';
import { supabaseClient } from './supabase-client-service';
import { LoginFormData, LoginResponse } from '@types/login';
import { storage } from '@utils/storage';

export const signIn = async (payload: LoginFormData): Promise<LoginResponse> => {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (error) {
      return {
        username: null,
        error: error.message
      };
    }

    const username = data.user.user_metadata.username;

    await storage.set('user', { username });

    return {
      username,
      error: null
    };
  } catch (error) {
    return {
      username: null,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

export const signUp = async (payload: SignupFormData): Promise<SignUpResponse> => {
  try {
    const {
      data: { user, session },
      error,
    } = await supabaseClient.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          username: payload.firstName + ' ' + payload.lastName,
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
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
};
