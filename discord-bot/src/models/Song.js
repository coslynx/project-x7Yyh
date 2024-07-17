```javascript
const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    enum: ['youtube', 'spotify', 'soundcloud', 'appleMusic', 'deezer', 'amazonMusic'],
    required: true,
  },
  duration: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  lyrics: {
    type: String,
  },
});

module.exports = mongoose.model('Song', SongSchema);
```