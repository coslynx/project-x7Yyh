```javascript
const { Client, Intents } = require('discord.js');
const { token, mongoURI } = require('./config/config');
const mongoose = require('mongoose');
const queueController = require('./controllers/queueController');
const musicController = require('./controllers/musicController');
const playlistController = require('./controllers/playlistController');
const userPermissionsController = require('./controllers/userPermissionsController');
const logger = require('./utils/logger');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] });

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    logger.info('Connected to MongoDB database.');
  })
  .catch((err) => {
    logger.error('Error connecting to MongoDB database:', err);
  });

client.on('ready', () => {
  logger.info(`${client.user.tag} is ready!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(process.env.PREFIX)) return;

  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'play') {
    const songUrl = args.join(' ');
    try {
      const song = await musicController.play(message, songUrl);
      logger.info(`Playing ${song.title} in ${message.guild.name}`);
    } catch (err) {
      logger.error('Error playing song:', err);
      musicController.sendErrorMessage(message, 'Error playing song. Please check the URL and try again.');
    }
  } else if (command === 'pause') {
    try {
      musicController.pause(message);
    } catch (err) {
      logger.error('Error pausing song:', err);
      musicController.sendErrorMessage(message, 'Error pausing song. Please try again later.');
    }
  } else if (command === 'resume') {
    try {
      musicController.resume(message);
    } catch (err) {
      logger.error('Error resuming song:', err);
      musicController.sendErrorMessage(message, 'Error resuming song. Please try again later.');
    }
  } else if (command === 'skip') {
    try {
      musicController.skip(message);
    } catch (err) {
      logger.error('Error skipping song:', err);
      musicController.sendErrorMessage(message, 'Error skipping song. Please try again later.');
    }
  } else if (command === 'volume') {
    const volume = parseInt(args[0]);
    if (isNaN(volume) || volume < 0 || volume > 100) {
      musicController.sendErrorMessage(message, 'Invalid volume level. Please enter a number between 0 and 100.');
      return;
    }
    try {
      musicController.volume(message, volume);
    } catch (err) {
      logger.error('Error setting volume:', err);
      musicController.sendErrorMessage(message, 'Error setting volume. Please try again later.');
    }
  } else if (command === 'queue') {
    try {
      const queue = queueController.getQueue(message);
      if (queue.length === 0) {
        musicController.sendErrorMessage(message, 'The queue is empty.');
      } else {
        musicController.sendQueue(message, queue);
      }
    } catch (err) {
      logger.error('Error getting queue:', err);
      musicController.sendErrorMessage(message, 'Error getting queue. Please try again later.');
    }
  } else if (command === 'remove') {
    const songIndex = parseInt(args[0]);
    if (isNaN(songIndex) || songIndex < 1) {
      musicController.sendErrorMessage(message, 'Invalid song index. Please enter a valid number.');
      return;
    }
    try {
      queueController.removeFromQueue(message, songIndex);
      musicController.sendSuccessMessage(message, `Song removed from queue.`);
    } catch (err) {
      logger.error('Error removing song from queue:', err);
      musicController.sendErrorMessage(message, 'Error removing song from queue. Please try again later.');
    }
  } else if (command === 'clear') {
    try {
      queueController.clearQueue(message);
      musicController.sendSuccessMessage(message, `Queue cleared.`);
    } catch (err) {
      logger.error('Error clearing queue:', err);
      musicController.sendErrorMessage(message, 'Error clearing queue. Please try again later.');
    }
  } else if (command === 'createplaylist') {
    const playlistName = args.join(' ');
    try {
      playlistController.createPlaylist(message, playlistName);
      musicController.sendSuccessMessage(message, `Playlist ${playlistName} created.`);
    } catch (err) {
      logger.error('Error creating playlist:', err);
      musicController.sendErrorMessage(message, 'Error creating playlist. Please try again later.');
    }
  } else if (command === 'editplaylist') {
    const playlistName = args[0];
    const songUrl = args.slice(1).join(' ');
    try {
      playlistController.editPlaylist(message, playlistName, songUrl);
      musicController.sendSuccessMessage(message, `Playlist ${playlistName} edited.`);
    } catch (err) {
      logger.error('Error editing playlist:', err);
      musicController.sendErrorMessage(message, 'Error editing playlist. Please try again later.');
    }
  } else if (command === 'saveplaylist') {
    const playlistName = args[0];
    try {
      playlistController.savePlaylist(message, playlistName);
      musicController.sendSuccessMessage(message, `Playlist ${playlistName} saved.`);
    } catch (err) {
      logger.error('Error saving playlist:', err);
      musicController.sendErrorMessage(message, 'Error saving playlist. Please try again later.');
    }
  } else if (command === 'loadplaylist') {
    const playlistName = args[0];
    try {
      playlistController.loadPlaylist(message, playlistName);
      musicController.sendSuccessMessage(message, `Playlist ${playlistName} loaded.`);
    } catch (err) {
      logger.error('Error loading playlist:', err);
      musicController.sendErrorMessage(message, 'Error loading playlist. Please try again later.');
    }
  } else if (command === 'addsongtoplaylist') {
    const playlistName = args[0];
    const songUrl = args.slice(1).join(' ');
    try {
      playlistController.addSongToPlaylist(message, playlistName, songUrl);
      musicController.sendSuccessMessage(message, `Song added to playlist ${playlistName}.`);
    } catch (err) {
      logger.error('Error adding song to playlist:', err);
      musicController.sendErrorMessage(message, 'Error adding song to playlist. Please try again later.');
    }
  } else if (command === 'removesongfromplaylist') {
    const playlistName = args[0];
    const songUrl = args.slice(1).join(' ');
    try {
      playlistController.removeSongFromPlaylist(message, playlistName, songUrl);
      musicController.sendSuccessMessage(message, `Song removed from playlist ${playlistName}.`);
    } catch (err) {
      logger.error('Error removing song from playlist:', err);
      musicController.sendErrorMessage(message, 'Error removing song from playlist. Please try again later.');
    }
  } else if (command === 'grantpermission') {
    const userId = args[0];
    const permission = args[1];
    try {
      userPermissionsController.grantPermission(message, userId, permission);
      musicController.sendSuccessMessage(message, `Permission ${permission} granted to user ${userId}.`);
    } catch (err) {
      logger.error('Error granting permission:', err);
      musicController.sendErrorMessage(message, 'Error granting permission. Please try again later.');
    }
  } else if (command === 'revokepermission') {
    const userId = args[0];
    const permission = args[1];
    try {
      userPermissionsController.revokePermission(message, userId, permission);
      musicController.sendSuccessMessage(message, `Permission ${permission} revoked from user ${userId}.`);
    } catch (err) {
      logger.error('Error revoking permission:', err);
      musicController.sendErrorMessage(message, 'Error revoking permission. Please try again later.');
    }
  } 
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  const user = newState.member;
  const channel = newState.channel;
  if (channel && channel.type === 'GUILD_VOICE' && channel.members.size === 1) {
    try {
      queueController.next(channel);
    } catch (err) {
      logger.error('Error playing next song:', err);
      musicController.sendErrorMessage(channel, 'Error playing next song. Please try again later.');
    }
  } else if (!channel && oldState.channel) {
    const channel = oldState.channel;
    if (channel.members.size === 0) {
      try {
        musicController.stop(channel);
        queueController.clearQueue(channel);
      } catch (err) {
        logger.error('Error stopping music and clearing queue:', err);
      }
    }
  }
});

client.login(token);
```