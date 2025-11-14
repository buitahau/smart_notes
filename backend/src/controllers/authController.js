import authService from '../services/authService.js';
import userService from '../services/userService.js';

class AuthController {
  async login(c) {
    try {
      const { email, password } = await c.req.json();

      if (!email || !password) {
        return c.json(
          {
            success: false,
            message: 'Email and password are required',
          },
          400
        );
      }

      const result = await authService.signIn(email, password);

      if (!result.success) {
        return c.json(
          {
            success: false,
            message: result.error,
          },
          401
        );
      }

      return c.json({
        success: true,
        user: result.user,
        session: result.session,
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          message: 'Internal server error',
        },
        500
      );
    }
  }

  async register(c) {
    try {
      const { email, password, firstName, lastName } = await c.req.json();

      if (!email || !password) {
        return c.json(
          {
            success: false,
            message: 'Email, password, first name, and last name are required',
          },
          400
        );
      }

      const result = await authService.signUp(email, password);

      if (!result.success) {
        return c.json(
          {
            success: false,
            message: result.error,
          },
          400
        );
      }

      if (!result.user?.id) {
        return c.json(
          {
            success: false,
            message: 'Failed to retrieve user information after sign up',
          },
          500
        );
      }

      const localUser = await userService.createUser(result.user.id, {
        email,
        firstName,
        lastName,
        status: false,
      });

      if (!localUser.success) {
        return c.json(
          {
            success: false,
            message: localUser.error ?? 'Failed to create local user profile',
          },
          500
        );
      }

      return c.json(
        {
          success: true,
          user: result.user,
          profile: localUser.user,
          session: result.session,
        },
        201
      );
    } catch (error) {
      return c.json(
        {
          success: false,
          message: 'Internal server error',
        },
        500
      );
    }
  }

  async logout(c) {
    try {
      const accessToken = c.req.header('authorization')?.replace('Bearer ', '');

      const result = await authService.signOut(accessToken);

      if (!result.success) {
        return c.json(
          {
            success: false,
            message: result.error,
          },
          400
        );
      }

      return c.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          message: 'Internal server error',
        },
        500
      );
    }
  }

  async validateToken(c) {
    try {
      const accessToken = c.req.header('authorization')?.replace('Bearer ', '');

      if (!accessToken) {
        return c.json(
          {
            success: false,
            valid: false,
            message: 'No token provided',
          },
          401
        );
      }

      const result = await authService.validateToken(accessToken);

      if (!result.success) {
        return c.json(
          {
            success: false,
            valid: false,
            message: result.error,
          },
          401
        );
      }

      return c.json({
        success: true,
        valid: true,
        user: result.user,
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          valid: false,
          message: 'Internal server error',
        },
        500
      );
    }
  }
}

export default new AuthController();
