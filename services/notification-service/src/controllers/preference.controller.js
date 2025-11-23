const { UserPreference } = require('../models');

class PreferenceController {
  async getUserPreferences(req, res, next) {
    try {
      const userId = req.user?.userId || req.headers['x-user-id'];

      let preferences = await UserPreference.findOne({ where: { user_id: userId } });
      
      if (!preferences) {
        // Create default preferences
        preferences = await UserPreference.create({ user_id: userId });
      }

      res.json({
        success: true,
        data: preferences
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePreferences(req, res, next) {
    try {
      const userId = req.user?.userId || req.headers['x-user-id'];
      const updateData = req.body;

      let preferences = await UserPreference.findOne({ where: { user_id: userId } });

      if (!preferences) {
        preferences = await UserPreference.create({
          user_id: userId,
          ...updateData
        });
      } else {
        await preferences.update(updateData);
      }

      res.json({
        success: true,
        message: 'Preferences updated successfully',
        data: preferences
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PreferenceController();
