```javascript
const { SlashCommandBuilder } = require('discord.js');
const queueController = require('../controllers/queueController');
const musicController = require('../controllers/musicController');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current song'),
  async execute(interaction) {
    const queue = queueController.getQueue(interaction.guildId);

    if (!queue) {
      return interaction.reply({ content: 'There is no song currently playing.', ephemeral: true });
    }

    musicController.skip(interaction.guildId);

    return interaction.reply({ content: 'Skipped the current song.', ephemeral: true });
  },
};
```