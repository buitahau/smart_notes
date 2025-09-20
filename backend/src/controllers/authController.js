const authService = require('../services/authService');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      const result = await authService.signIn(email, password);

      if (!result.success) {
        return res.status(401).json({
          success: false,
          message: result.error,
        });
      }

      res.json({
        success: true,
        user: result.user,
        session: result.session,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async register(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      const result = await authService.signUp(email, password);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error,
        });
      }

      res.status(201).json({
        success: true,
        user: result.user,
        session: result.session,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async logout(req, res) {
    try {
      const accessToken = req.headers.authorization?.replace('Bearer ', '');

      const result = await authService.signOut(accessToken);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error,
        });
      }

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async validateToken(req, res) {
    try {
      const accessToken = req.headers.authorization?.replace('Bearer ', '');

      if (!accessToken) {
        return res.status(401).json({
          success: false,
          valid: false,
          message: 'No token provided',
        });
      }

      const result = await authService.validateToken(accessToken);

      if (!result.success) {
        return res.status(401).json({
          success: false,
          valid: false,
          message: result.error,
        });
      }

      res.json({
        success: true,
        valid: true,
        user: result.user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        valid: false,
        message: 'Internal server error',
      });
    }
  }
}

module.exports = new AuthController();
