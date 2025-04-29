/**
 * @file s3Config.js
 * @description AWS S3 configuration and utility functions
 */

import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Configure AWS with region
AWS.config.update({
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

const PROFILE_PICTURES_BUCKET = process.env.S3_BUCKET_NAME;

export const uploadToS3 = async (file, key) => {
    try {
        const bufferStream = new Buffer.from(file.buffer);
        
        const params = {
            Bucket: PROFILE_PICTURES_BUCKET,
            Key: key,
            Body: bufferStream,
            ContentType: file.mimetype,
            ACL: 'public-read'
        };

        const result = await s3.upload(params).promise();
        return result.Location; 
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw error;
    }
};

export const deleteFromS3 = async (key) => {
    try {
        const params = {
            Bucket: PROFILE_PICTURES_BUCKET,
            Key: key
        };

        await s3.deleteObject(params).promise();
    } catch (error) {
        console.error('Error deleting from S3:', error);
        throw error;
    }
};

export const generateProfilePictureKey = (userId) => {
    const timestamp = Date.now();
    return `profile-pictures/${userId}/${timestamp}.jpg`;
}; 