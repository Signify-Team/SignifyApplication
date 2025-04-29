/**
 * @file s3Config.js
 * @description AWS S3 configuration and utility functions
 */

import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3();

const PROFILE_PICTURES_BUCKET = process.env.S3_PROFILE_PICTURES_BUCKET;

export const uploadToS3 = async (file, key) => {
    try {
        const params = {
            Bucket: PROFILE_PICTURES_BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'aws-exec-read'
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