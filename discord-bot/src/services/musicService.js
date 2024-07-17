```javascript
const ytdl = require('ytdl-core');
const Spotify = require('node-spotify-api');
const SoundCloud = require('soundcloud-api');
const Genius = require('genius-lyrics-api');
const AppleMusic = require('apple-music-api');
const Deezer = require('deezer-api');
const AmazonMusic = require('amazon-music-api');
const axios = require('axios');
const { config } = require('../../config/config');
const { logger } = require('../../utils/logger');

const spotifyApi = new Spotify({
  id: config.spotify.clientId,
  secret: config.spotify.clientSecret,
});

const soundCloudApi = new SoundCloud({
  client_id: config.soundcloud.clientId,
  client_secret: config.soundcloud.clientSecret,
});

const geniusApi = new Genius.Client(config.genius.accessToken);

const appleMusicApi = new AppleMusic({
  storefront: config.appleMusic.storefront,
  developerToken: config.appleMusic.developerToken,
});

const deezerApi = new Deezer({
  app_id: config.deezer.appId,
  app_secret: config.deezer.appSecret,
});

const amazonMusicApi = new AmazonMusic({
  accessKey: config.amazonMusic.accessKey,
  secretKey: config.amazonMusic.secretKey,
  region: config.amazonMusic.region,
});

class MusicService {
  async getSongFromYouTube(url) {
    try {
      const info = await ytdl.getInfo(url);
      const title = info.videoDetails.title;
      const artist = info.videoDetails.author.name;
      const duration = info.videoDetails.lengthSeconds;
      const thumbnail = info.videoDetails.thumbnail.thumbnails[0].url;
      return { title, artist, duration, thumbnail, url, source: 'youtube' };
    } catch (error) {
      logger.error(`Error fetching song information from YouTube: ${error}`);
      throw error;
    }
  }

  async getSongFromSpotify(url) {
    try {
      const trackId = url.split('/').pop();
      const trackData = await spotifyApi.getTrack(trackId);
      const title = trackData.body.name;
      const artist = trackData.body.artists[0].name;
      const duration = trackData.body.duration_ms;
      const thumbnail = trackData.body.album.images[0].url;
      return { title, artist, duration, thumbnail, url, source: 'spotify' };
    } catch (error) {
      logger.error(`Error fetching song information from Spotify: ${error}`);
      throw error;
    }
  }

  async getSongFromSoundCloud(url) {
    try {
      const trackData = await soundCloudApi.get('/tracks', { url });
      const title = trackData.title;
      const artist = trackData.user.username;
      const duration = trackData.duration;
      const thumbnail = trackData.artwork_url;
      return { title, artist, duration, thumbnail, url, source: 'soundcloud' };
    } catch (error) {
      logger.error(`Error fetching song information from SoundCloud: ${error}`);
      throw error;
    }
  }

  async getSongFromAppleMusic(url) {
    try {
      const trackId = url.split('/').pop();
      const trackData = await appleMusicApi.get('/v1/catalog/us/songs/' + trackId);
      const title = trackData.data[0].attributes.name;
      const artist = trackData.data[0].attributes.artistName;
      const duration = trackData.data[0].attributes.durationInMillis;
      const thumbnail = trackData.data[0].attributes.artwork.url;
      return { title, artist, duration, thumbnail, url, source: 'appleMusic' };
    } catch (error) {
      logger.error(`Error fetching song information from Apple Music: ${error}`);
      throw error;
    }
  }

  async getSongFromDeezer(url) {
    try {
      const trackId = url.split('/').pop();
      const trackData = await deezerApi.get('/track/' + trackId);
      const title = trackData.title;
      const artist = trackData.artist.name;
      const duration = trackData.duration;
      const thumbnail = trackData.album.cover_xl;
      return { title, artist, duration, thumbnail, url, source: 'deezer' };
    } catch (error) {
      logger.error(`Error fetching song information from Deezer: ${error}`);
      throw error;
    }
  }

  async getSongFromAmazonMusic(url) {
    try {
      const trackId = url.split('/').pop();
      const trackData = await amazonMusicApi.getTrack(trackId);
      const title = trackData.track.title;
      const artist = trackData.track.artist;
      const duration = trackData.track.duration;
      const thumbnail = trackData.track.album.artUrl;
      return { title, artist, duration, thumbnail, url, source: 'amazonMusic' };
    } catch (error) {
      logger.error(`Error fetching song information from Amazon Music: ${error}`);
      throw error;
    }
  }

  async getSongLyrics(title, artist) {
    try {
      const response = await geniusApi.search(title + ' ' + artist);
      const song = response.hits[0];
      const lyrics = await geniusApi.getLyrics(song.result.id);
      return lyrics;
    } catch (error) {
      logger.error(`Error fetching lyrics: ${error}`);
      return 'Lyrics not found';
    }
  }
}

module.exports = new MusicService();

```