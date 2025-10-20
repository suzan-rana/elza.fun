import {
    Controller,
    Post,
    Delete,
    Get,
    Param,
    Query,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
    BadRequestException,
    Body,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { UploadResponseDto } from './dto/upload-response.dto';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Upload a single image to Cloudinary' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Image file to upload',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file (JPEG, PNG, GIF, WebP, SVG)',
                },
                folder: {
                    type: 'string',
                    description: 'Optional folder name in Cloudinary',
                    example: 'products',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Image uploaded successfully',
        type: UploadResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - invalid file or upload failed',
    })
    async uploadImage(
        @UploadedFile() file: Express.Multer.File,
        @Query('folder') folder?: string,
    ): Promise<UploadResponseDto> {
        return this.uploadService.uploadImage(file, folder);
    }

    @Post('images')
    @UseInterceptors(FilesInterceptor('files', 10))
    @ApiOperation({ summary: 'Upload multiple images to Cloudinary' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Multiple image files to upload',
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    description: 'Image files (JPEG, PNG, GIF, WebP, SVG)',
                },
                folder: {
                    type: 'string',
                    description: 'Optional folder name in Cloudinary',
                    example: 'products',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Images uploaded successfully',
        type: [UploadResponseDto],
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - invalid files or upload failed',
    })
    async uploadImages(
        @UploadedFiles() files: Express.Multer.File[],
        @Query('folder') folder?: string,
    ): Promise<UploadResponseDto[]> {
        return this.uploadService.uploadMultipleImages(files, folder);
    }

    @Delete('image/:publicId')
    @ApiOperation({ summary: 'Delete an image from Cloudinary' })
    @ApiResponse({
        status: 200,
        description: 'Image deleted successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - failed to delete image',
    })
    async deleteImage(
        @Param('publicId') publicId: string,
    ): Promise<{ success: boolean; message: string }> {
        return this.uploadService.deleteImage(publicId);
    }

    @Get('image/:publicId/info')
    @ApiOperation({ summary: 'Get information about an uploaded image' })
    @ApiResponse({
        status: 200,
        description: 'Image information retrieved successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - failed to get image info',
    })
    async getImageInfo(@Param('publicId') publicId: string): Promise<any> {
        return this.uploadService.getImageInfo(publicId);
    }
}
