```javascript
const { SlashCommandBuilder } = require('discord.js');
const queueController = require('../controllers/queueController');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Manage the music queue')
    .addSubcommand(subcommand =>
      subcommand
        .setName('show')
        .setDescription('Show the current music queue')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a song from the queue')
        .addIntegerOption(option =>
          option
            .setName('song-number')
            .setDescription('The number of the song to remove')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('clear')
        .setDescription('Clear the entire music queue')
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'show') {
      const queue = queueController.getQueue(interaction.guild.id);

      if (queue.length === 0) {
        await interaction.reply('The queue is empty!');
        return;
      }

      const queueString = queue.map((song, index) => `${index + 1}. ${song.title} - ${song.artist}`).join('\n');

      await interaction.reply(`**Current Queue:**\n${queueString}`);
    } else if (subcommand === 'remove') {
      const songNumber = interaction.options.getInteger('song-number');

      const success = queueController.removeFromQueue(interaction.guild.id, songNumber);

      if (success) {
        await interaction.reply(`Song ${songNumber} has been removed from the queue.`);
      } else {
        await interaction.reply(`Song ${songNumber} is not in the queue.`);
      }
    } else if (subcommand === 'clear') {
      queueController.clearQueue(interaction.guild.id);
      await interaction.reply('The queue has been cleared!');
    }
  },
};

```