import { Injectable, BadRequestException } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { UploadResponseDto } from './dto/upload-response.dto';

@Injectable()
export class UploadService {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    async uploadImage(
        file: Express.Multer.File,
        folder?: string,
        options?: {
            publicId?: string;
            transformation?: any;
            tags?: string[];
        }
    ): Promise<UploadResponseDto> {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        // Validate file type
        const allowedMimeTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            'video/mp4',
            'video/webm',
            'video/quicktime',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                `File type ${file.mimetype} is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`,
            );
        }

        // Validate file size (50MB limit for videos, 10MB for others)
        const maxSize = file.mimetype.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new BadRequestException(
                `File size ${file.size} bytes exceeds maximum allowed size of ${maxSize} bytes`,
            );
        }

        try {
            const result = await this.cloudinaryService.uploadImage(file, folder, options);
            return result;
        } catch (error) {
            throw new BadRequestException(`Upload failed: ${error.message}`);
        }
    }

    async uploadMultipleImages(
        files: Express.Multer.File[],
        folder?: string,
    ): Promise<UploadResponseDto[]> {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files provided');
        }

        if (files.length > 10) {
            throw new BadRequestException('Maximum 10 files allowed per request');
        }

        const uploadPromises = files.map((file) =>
            this.uploadImage(file, folder),
        );

        try {
            const results = await Promise.all(uploadPromises);
            return results;
        } catch (error) {
            throw new BadRequestException(`Batch upload failed: ${error.message}`);
        }
    }

    async deleteImage(publicId: string): Promise<{ success: boolean; message: string }> {
        try {
            const success = await this.cloudinaryService.deleteImage(publicId);
            return {
                success,
                message: success ? 'Image deleted successfully' : 'Failed to delete image',
            };
        } catch (error) {
            throw new BadRequestException(`Delete failed: ${error.message}`);
        }
    }

    async getImageInfo(publicId: string): Promise<any> {
        try {
            return await this.cloudinaryService.getImageInfo(publicId);
        } catch (error) {
            throw new BadRequestException(`Failed to get image info: ${error.message}`);
        }
    }
}
