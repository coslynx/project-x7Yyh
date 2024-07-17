```javascript
const { User } = require('../models');
const { DiscordAPI } = require('../services/discordAPI');

class UserPermissionsController {
  async checkPermissions(userId, command) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found.');
      }
      const commandPermissions = await DiscordAPI.getCommandPermissions(command);
      if (!commandPermissions) {
        throw new Error('Command permissions not found.');
      }
      if (user.permissions.includes(command)) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async grantPermission(userId, command) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found.');
      }
      if (!user.permissions.includes(command)) {
        user.permissions.push(command);
        await user.save();
        return true;
      } else {
        throw new Error('User already has permission for this command.');
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async revokePermission(userId, command) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found.');
      }
      if (user.permissions.includes(command)) {
        user.permissions = user.permissions.filter((perm) => perm !== command);
        await user.save();
        return true;
      } else {
        throw new Error('User does not have permission for this command.');
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

module.exports = new UserPermissionsController();

```