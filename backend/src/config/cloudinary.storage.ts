import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary';

export const crearStorage = (folder:string) => {

  return new CloudinaryStorage({
    cloudinary,

    params: async () => ({
      folder,
      allowed_formats: [
        'jpg',
        'jpeg',
        'png',
        'webp'
      ],
    }),

  });

};