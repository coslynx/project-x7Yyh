```javascript
const { SlashCommandBuilder } = require('discord.js');
const queueController = require('../controllers/queueController');
const musicService = require('../services/musicService');
const ytdl = require('ytdl-core');
const Spotify = require('node-spotify-api');
const SoundCloud = require('soundcloud-api');
const AppleMusic = require('apple-music-api');
const Deezer = require('deezer-api');
const AmazonMusic = require('amazon-music-api');
const Genius = require('genius-lyrics-api');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song or playlist')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('The song or playlist URL')
        .setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString('query');

    try {
      let song;

      if (query.includes('youtube.com')) {
        song = await musicService.getSongFromYouTube(query);
      } else if (query.includes('spotify.com')) {
        song = await musicService.getSongFromSpotify(query);
      } else if (query.includes('soundcloud.com')) {
        song = await musicService.getSongFromSoundCloud(query);
      } else if (query.includes('music.apple.com')) {
        song = await musicService.getSongFromAppleMusic(query);
      } else if (query.includes('deezer.com')) {
        song = await musicService.getSongFromDeezer(query);
      } else if (query.includes('amazon.com/music')) {
        song = await musicService.getSongFromAmazonMusic(query);
      } else {
        return interaction.reply('Invalid URL provided. Please enter a valid YouTube, Spotify, SoundCloud, Apple Music, Deezer or Amazon Music URL.');
      }

      await queueController.addToQueue(interaction.guild, song);

      if (!interaction.guild.members.cache.get(interaction.client.user.id).voice.channel) {
        return interaction.reply('I need to be in a voice channel to play music!');
      }

      if (!interaction.member.voice.channel) {
        return interaction.reply('You need to be in a voice channel to play music!');
      }

      if (!interaction.guild.members.cache.get(interaction.client.user.id).voice.channel.members.size) {
        return interaction.reply('No one else is in this voice channel!');
      }

      if (!interaction.guild.members.cache.get(interaction.client.user.id).voice.channel.joinable) {
        return interaction.reply('I can\'t join this voice channel!');
      }

      const connection = await interaction.guild.members.cache.get(interaction.client.user.id).voice.channel.join();

      if (queueController.getQueue(interaction.guild).length === 1) {
        // If the queue is empty, play the song immediately
        const stream = ytdl(song.url, { filter: 'audioonly' });

        const dispatcher = connection.play(stream, { volume: 0.5 });

        dispatcher.on('finish', () => {
          queueController.next(interaction.guild);
        });
      } else {
        // If the queue is not empty, just add the song to the queue
        interaction.reply(`Added ${song.title} to the queue!`);
      }
    } catch (error) {
      console.error(error);
      return interaction.reply('An error occurred while playing music.');
    }
  }
};

```