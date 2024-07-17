```javascript
const { Playlist } = require('../models');
const { logger } = require('../utils');

class PlaylistController {
  async createPlaylist(guildId, userId, playlistName) {
    try {
      const newPlaylist = await Playlist.create({
        guildId,
        userId,
        name: playlistName,
        songs: [],
      });
      logger.info(`Playlist created: ${newPlaylist.name}`);
      return newPlaylist;
    } catch (error) {
      logger.error(`Error creating playlist: ${error.message}`);
      throw error;
    }
  }

  async editPlaylist(playlistId, playlistName) {
    try {
      const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { name: playlistName },
        { new: true }
      );
      logger.info(`Playlist updated: ${updatedPlaylist.name}`);
      return updatedPlaylist;
    } catch (error) {
      logger.error(`Error editing playlist: ${error.message}`);
      throw error;
    }
  }

  async savePlaylist(playlist) {
    try {
      const savedPlaylist = await playlist.save();
      logger.info(`Playlist saved: ${savedPlaylist.name}`);
      return savedPlaylist;
    } catch (error) {
      logger.error(`Error saving playlist: ${error.message}`);
      throw error;
    }
  }

  async loadPlaylist(playlistId) {
    try {
      const playlist = await Playlist.findById(playlistId);
      logger.info(`Playlist loaded: ${playlist.name}`);
      return playlist;
    } catch (error) {
      logger.error(`Error loading playlist: ${error.message}`);
      throw error;
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    try {
      const playlist = await Playlist.findById(playlistId);
      if (!playlist.songs.includes(songId)) {
        playlist.songs.push(songId);
        await playlist.save();
        logger.info(`Song added to playlist: ${playlist.name}`);
        return playlist;
      } else {
        logger.info(`Song already exists in playlist: ${playlist.name}`);
        return playlist;
      }
    } catch (error) {
      logger.error(`Error adding song to playlist: ${error.message}`);
      throw error;
    }
  }

  async removeSongFromPlaylist(playlistId, songId) {
    try {
      const playlist = await Playlist.findById(playlistId);
      if (playlist.songs.includes(songId)) {
        playlist.songs = playlist.songs.filter((id) => id !== songId);
        await playlist.save();
        logger.info(`Song removed from playlist: ${playlist.name}`);
        return playlist;
      } else {
        logger.info(`Song not found in playlist: ${playlist.name}`);
        return playlist;
      }
    } catch (error) {
      logger.error(`Error removing song from playlist: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new PlaylistController();
```