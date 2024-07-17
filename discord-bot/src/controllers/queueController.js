```javascript
const Queue = require('queue');

class QueueController {
  constructor() {
    this.queue = new Queue();
  }

  addToQueue(song) {
    this.queue.push(song);
  }

  removeFromQueue(index) {
    this.queue.splice(index, 1);
  }

  clearQueue() {
    this.queue.clear();
  }

  getQueue() {
    return this.queue.items;
  }

  next() {
    const song = this.queue.shift();
    return song;
  }
}

module.exports = QueueController;
```