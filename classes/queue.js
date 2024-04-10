class RetryQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(message) {
        this.queue.push(message);
    }

    dequeue() {
        return this.queue.shift();
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}

module.exports = RetryQueue
