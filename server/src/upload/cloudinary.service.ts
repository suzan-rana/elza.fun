import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    private readonly logger = new Logger(CloudinaryService.name);

    constructor(private configService: ConfigService) {
        // Configure Cloudinary
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadImage(
        file: Express.Multer.File,
        folder?: string,
        options?: {
            publicId?: string;
            transformation?: any;
            tags?: string[];
        }
    ): Promise<{
        url: string;
        publicId: string;
        originalName: string;
        size: number;
        mimeType: string;
        folder: string;
        secureUrl: string;
        width?: number;
        height?: number;
        format: string;
    }> {
        try {
            this.logger.log(`Uploading image: ${file.originalname} to folder: ${folder || 'uploads'}`);

            // Convert buffer to base64 string
            const base64String = file.buffer.toString('base64');
            const dataUri = `data:${file.mimetype};base64,${base64String}`;

            // Generate public ID with folder structure
            const timestamp = Date.now();
            const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
            const publicId = options?.publicId || `${folder || 'uploads'}/${timestamp}_${sanitizedName}`;

            // Upload to Cloudinary with enhanced options
            const result = await cloudinary.uploader.upload(dataUri, {
                public_id: publicId,
                folder: folder || 'uploads',
                resource_type: 'auto',
                quality: 'auto',
                fetch_format: 'auto',
                transformation: options?.transformation,
                tags: options?.tags || ['elza-platform'],
                overwrite: false,
                invalidate: true,
            });

            this.logger.log(`Successfully uploaded image: ${result.public_id}`);

            return {
                url: result.secure_url,
                publicId: result.public_id,
                originalName: file.originalname,
                size: file.size,
                mimeType: file.mimetype,
                folder: result.folder || folder || 'uploads',
                secureUrl: result.secure_url,
                width: result.width,
                height: result.height,
                format: result.format,
            };
        } catch (error) {
            this.logger.error(`Failed to upload image: ${error.message}`);
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    }

    async deleteImage(publicId: string): Promise<boolean> {
        try {
            this.logger.log(`Deleting image: ${publicId}`);

            const result = await cloudinary.uploader.destroy(publicId);

            if (result.result === 'ok') {
                this.logger.log(`Successfully deleted image: ${publicId}`);
                return true;
            } else {
                this.logger.warn(`Failed to delete image: ${publicId}, result: ${result.result}`);
                return false;
            }
        } catch (error) {
            this.logger.error(`Error deleting image: ${error.message}`);
            throw new Error(`Failed to delete image: ${error.message}`);
        }
    }

    async getImageInfo(publicId: string): Promise<any> {
        try {
            this.logger.log(`Getting image info: ${publicId}`);

            const result = await cloudinary.api.resource(publicId);
            return result;
        } catch (error) {
            this.logger.error(`Error getting image info: ${error.message}`);
            throw new Error(`Failed to get image info: ${error.message}`);
        }
    }
}
