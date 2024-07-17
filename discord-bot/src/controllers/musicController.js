```javascript
const { Client, VoiceChannel } = require('discord.js');
const ytdl = require('ytdl-core');

class MusicController {
  constructor(client, queueController) {
    this.client = client;
    this.queueController = queueController;
    this.dispatcher = null;
  }

  async play(message, song) {
    try {
      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel) {
        return message.channel.send('You need to be in a voice channel to play music!');
      }

      const connection = await voiceChannel.join();

      const stream = ytdl(song.url, { filter: 'audioonly' });
      this.dispatcher = connection.play(stream);

      this.dispatcher.on('finish', () => {
        this.queueController.next(message);
      });

      this.dispatcher.on('error', (error) => {
        console.error('Error playing music:', error);
        message.channel.send('There was an error playing the song!');
        this.queueController.next(message);
      });

      message.channel.send(`Now playing: ${song.title}`);
    } catch (error) {
      console.error('Error playing music:', error);
      message.channel.send('There was an error playing the song!');
    }
  }

  pause(message) {
    if (!this.dispatcher) {
      return message.channel.send('There is no song currently playing!');
    }

    this.dispatcher.pause();
    message.channel.send('Music paused!');
  }

  resume(message) {
    if (!this.dispatcher) {
      return message.channel.send('There is no song currently playing!');
    }

    this.dispatcher.resume();
    message.channel.send('Music resumed!');
  }

  skip(message) {
    if (!this.dispatcher) {
      return message.channel.send('There is no song currently playing!');
    }

    this.dispatcher.end();
    message.channel.send('Skipped the current song!');
  }

  volume(message, volume) {
    if (!this.dispatcher) {
      return message.channel.send('There is no song currently playing!');
    }

    if (volume < 0 || volume > 100) {
      return message.channel.send('Volume must be between 0 and 100!');
    }

    this.dispatcher.setVolume(volume / 100);
    message.channel.send(`Volume set to ${volume}%`);
  }

  stop(message) {
    if (!this.dispatcher) {
      return message.channel.send('There is no song currently playing!');
    }

    this.dispatcher.end();
    message.member.voice.channel.leave();
    message.channel.send('Music stopped!');
  }
}

module.exports = MusicController;

```