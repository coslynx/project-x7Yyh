```javascript
const { MessageEmbed } = require('discord.js');

module.exports = {
  handleError: (error, message, interaction) => {
    console.error(error);

    if (message) {
      const errorEmbed = new MessageEmbed()
        .setColor('RED')
        .setTitle('An error occurred!')
        .setDescription('Something went wrong. Please try again later.');
      message.channel.send({ embeds: [errorEmbed] });
    } else if (interaction) {
      interaction.reply({ content: 'An error occurred! Please try again later.', ephemeral: true });
    }
  },
  sendErrorMessage: (message, errorText) => {
    const errorEmbed = new MessageEmbed()
      .setColor('RED')
      .setTitle('Error')
      .setDescription(errorText);
    message.channel.send({ embeds: [errorEmbed] });
  },
};
```