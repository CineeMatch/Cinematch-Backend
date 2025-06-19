import cloudinary from 'cloudinary';
import globalConfig from './globalConfig.js';

cloudinary.config({
    cloud_name: globalConfig.cloudinary.cloudName,
    api_key: globalConfig.cloudinary.apiKey,
    api_secret: globalConfig.cloudinary.apiSecret,
    
});

export default cloudinary;