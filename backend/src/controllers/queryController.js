const queryService = require('../services/queryService');

class QueryController {
    async query(req, res) {
        try {
            const { query } = req.body;
            // Extract userId from authenticated user (set by authenticateToken middleware)
            const userId = req.user?.id;

            // Enhanced validation
            if (!userId) {
                return res.status(401).json({
                success: false,
                message: 'User authentication required'
                });
            }
            const respose = await queryService.query(userId, query);
            res.status(200).json({
                success: true,
                notes: respose
            });
        } catch (error) {
            console.error('Error querying note:', error);
            res.status(500).json({
              success: false,
              message: 'Internal server error while querying note'
            });
          }
    }
}

module.exports = new QueryController();