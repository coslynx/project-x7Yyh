```javascript
const queue = require('queue');

class QueueService {
  constructor() {
    this.queue = new queue();
  }

  addToQueue(song) {
    this.queue.push(song);
  }

  removeFromQueue(song) {
    this.queue.remove(song);
  }

  clearQueue() {
    this.queue.clear();
  }

  getQueue() {
    return this.queue;
  }

  next() {
    const song = this.queue.shift();
    if (song) {
      return song;
    }
    return null;
  }
}

module.exports = QueueService;

```