const Bull = require('bull');
const imageThumbnail = require('image-thumbnail');
const { getFileFromDB, saveThumbnailLocally } = require('./fileService'); // Assuming you have these functions

const fileQueue = new Bull('fileQueue');

fileQueue.process(async (job) => {
    const { userId, fileId } = job.data;

    if (!fileId) {
        throw new Error('Missing fileId');
    }

    if (!userId) {
        throw new Error('Missing userId');
    }

    const file = await getFileFromDB(userId, fileId);
    if (!file) {
        throw new Error('File not found');
    }

    const sizes = [500, 250, 100];
    for (const size of sizes) {
        const thumbnail = await imageThumbnail(file.path, { width: size });
        await saveThumbnailLocally(file.path, size, thumbnail);
    }
});
