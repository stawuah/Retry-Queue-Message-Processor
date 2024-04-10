const RetryQueue = require("./classes/queue")
const Broker = require("./classes/broker")

async function processMessage(message) {
    // Example processing logic
    console.log('Processing message:', message);

    // Simulate processing failure
    if (Math.random() < 0.5) {
        throw new Error('Processing failed');
    }

    console.log('Processing successful  ');
}

async function retryFailedMessages(retryQueue, broker) {
    let retryCount = 0;
    const maxRetries = 10; // Maximum number of retries
    const baseDelay = 1000; // Base delay in milliseconds

    while (!retryQueue.isEmpty()) {
        const message = retryQueue.dequeue();
        if (broker.isSuccessful(message)) {
            // Skip retrying if the message has already been successfully processed
            console.log(`Message '${message}' has already been successfully processed. Skipping retry.`);
            continue;
        }
        try {
            await processMessage(message);
            broker.markAsSuccessful(message); // Mark message as successful
            console.table(broker.markAsSuccessful(message))
            retryCount = 0; // Reset retry count
        } catch (error) {
            console.error('Error processing message, retrying...', error.message);

            // Calculate delay using exponential backoff
            const delay = Math.pow(2, retryCount) * baseDelay;
            console.log(`Retrying in ${delay} milliseconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));

            // Re-enqueue the message for retry
            retryQueue.enqueue(message);
            retryCount++;

            if (retryCount >= maxRetries) {
                console.log(`Maximum retries reached for message: ${message}`);
                break; // Exit the loop if max retries exceeded
            }
        }
    }
        // Display successful messages in a table
        console.log('\nSuccessful Messages:');
        console.table(broker.successfulMessages.map(message => ({ Message: message })));

}

async function main() {
    const retryQueue = new RetryQueue();
    const broker = new Broker();

    // Example: Enqueue some messages
    retryQueue.enqueue('Message 1');
    retryQueue.enqueue('Message 2');
    retryQueue.enqueue('Message 3');
    retryQueue.enqueue('Message 4');
    retryQueue.enqueue('Message 5');
    retryQueue.enqueue('Message 6');
    retryQueue.enqueue('Message 7');
    retryQueue.enqueue('Message 8');
    retryQueue.enqueue('Message 9');
    retryQueue.enqueue('Message 10');

    // Retry failed messages
    await retryFailedMessages(retryQueue, broker);
}

main().catch(error => console.error('Error:', error));

