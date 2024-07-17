```javascript
const mongoose = require('mongoose');
const User = require('../models/User');

class UserPermissionsService {
  /**
   * Checks if a user has permissions to execute a command.
   *
   * @param {string} userId - The Discord ID of the user.
   * @param {string} command - The name of the command.
   * @returns {Promise<boolean>} - True if the user has permissions, false otherwise.
   */
  async checkPermissions(userId, command) {
    try {
      const user = await User.findOne({ discordId: userId });
      if (!user) {
        return false;
      }
      return user.permissions.includes(command);
    } catch (error) {
      console.error('Error checking user permissions:', error);
      return false;
    }
  }

  /**
   * Grants permissions to a user.
   *
   * @param {string} userId - The Discord ID of the user.
   * @param {string} command - The name of the command.
   * @returns {Promise<void>}
   */
  async grantPermission(userId, command) {
    try {
      await User.findOneAndUpdate({ discordId: userId }, { $addToSet: { permissions: command } });
    } catch (error) {
      console.error('Error granting user permissions:', error);
    }
  }

  /**
   * Revokes permissions from a user.
   *
   * @param {string} userId - The Discord ID of the user.
   * @param {string} command - The name of the command.
   * @returns {Promise<void>}
   */
  async revokePermission(userId, command) {
    try {
      await User.findOneAndUpdate({ discordId: userId }, { $pull: { permissions: command } });
    } catch (error) {
      console.error('Error revoking user permissions:', error);
    }
  }
}

module.exports = new UserPermissionsService();
```