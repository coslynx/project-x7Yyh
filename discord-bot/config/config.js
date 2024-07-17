```javascript
require('dotenv').config();

module.exports = {
  discordToken: process.env.DISCORD_TOKEN,
  databaseURL: process.env.DATABASE_URL,
  botPrefix: process.env.BOT_PREFIX || '!',
  youtubeAPIKey: process.env.YOUTUBE_API_KEY,
  spotifyClientID: process.env.SPOTIFY_CLIENT_ID,
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  soundcloudClientID: process.env.SOUNDCLOUD_CLIENT_ID,
  soundcloudClientSecret: process.env.SOUNDCLOUD_CLIENT_SECRET,
  geniusAPIKey: process.env.GENIUS_API_KEY,
  appleMusicDeveloperToken: process.env.APPLE_MUSIC_DEVELOPER_TOKEN,
  deezerAppID: process.env.DEEZER_APP_ID,
  deezerAppSecret: process.env.DEEZER_APP_SECRET,
  amazonMusicAPIKey: process.env.AMAZON_MUSIC_API_KEY,
};

```