class Broker {
    constructor() {
        this.successfulMessages = [];
        
    }

    markAsSuccessful(message) {
        this.successfulMessages.push(message);
    }

    isSuccessful(message) {
        return this.successfulMessages.includes(message);
    }
}

module.exports =  Broker