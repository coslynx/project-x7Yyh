```javascript
const { SlashCommandBuilder } = require('discord.js');
const musicController = require('../controllers/musicController');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Adjusts the volume of the music player')
    .addIntegerOption(option =>
      option.setName('volume')
        .setDescription('Set the volume (1-100)')
        .setRequired(true)
    ),
  async execute(interaction) {
    const volume = interaction.options.getInteger('volume');

    if (volume < 1 || volume > 100) {
      return interaction.reply({ content: 'Volume must be between 1 and 100.', ephemeral: true });
    }

    try {
      await musicController.setVolume(interaction.guild, volume / 100);
      await interaction.reply(`Volume set to ${volume}%`);
    } catch (error) {
      console.error('Error setting volume:', error);
      await interaction.reply({ content: 'An error occurred while setting the volume.', ephemeral: true });
    }
  },
};

```