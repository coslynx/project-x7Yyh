```javascript
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');
const mongoose = require('mongoose');

class PlaylistService {
  async createPlaylist(name, ownerId) {
    try {
      const newPlaylist = new Playlist({
        name,
        ownerId,
        songs: [],
      });

      await newPlaylist.save();
      return newPlaylist;
    } catch (error) {
      throw new Error('Failed to create playlist');
    }
  }

  async editPlaylist(playlistId, name, songs) {
    try {
      const playlist = await Playlist.findById(playlistId);

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      playlist.name = name;
      playlist.songs = songs;

      await playlist.save();
      return playlist;
    } catch (error) {
      throw new Error('Failed to edit playlist');
    }
  }

  async savePlaylist(playlist) {
    try {
      const savedPlaylist = await playlist.save();
      return savedPlaylist;
    } catch (error) {
      throw new Error('Failed to save playlist');
    }
  }

  async loadPlaylist(playlistId) {
    try {
      const playlist = await Playlist.findById(playlistId).populate('songs');

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      return playlist;
    } catch (error) {
      throw new Error('Failed to load playlist');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    try {
      const playlist = await Playlist.findById(playlistId);

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      const song = await Song.findById(songId);

      if (!song) {
        throw new Error('Song not found');
      }

      playlist.songs.push(songId);
      await playlist.save();
      return playlist;
    } catch (error) {
      throw new Error('Failed to add song to playlist');
    }
  }

  async removeSongFromPlaylist(playlistId, songId) {
    try {
      const playlist = await Playlist.findById(playlistId);

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      playlist.songs = playlist.songs.filter((id) => id.toString() !== songId.toString());
      await playlist.save();
      return playlist;
    } catch (error) {
      throw new Error('Failed to remove song from playlist');
    }
  }

  async deletePlaylist(playlistId) {
    try {
      const playlist = await Playlist.findByIdAndDelete(playlistId);

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      return playlist;
    } catch (error) {
      throw new Error('Failed to delete playlist');
    }
  }

  async getPlaylistsByUserId(userId) {
    try {
      const playlists = await Playlist.find({ ownerId: userId }).populate('songs');
      return playlists;
    } catch (error) {
      throw new Error('Failed to get playlists');
    }
  }
}

module.exports = new PlaylistService();
```