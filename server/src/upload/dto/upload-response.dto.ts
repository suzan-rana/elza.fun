import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
    @ApiProperty({
        description: 'The public URL of the uploaded image',
        example: 'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/sample.jpg',
    })
    url: string;

    @ApiProperty({
        description: 'The public ID of the uploaded image',
        example: 'products/1234567890_sample',
    })
    publicId: string;

    @ApiProperty({
        description: 'The original filename',
        example: 'sample.jpg',
    })
    originalName: string;

    @ApiProperty({
        description: 'The size of the uploaded file in bytes',
        example: 1024000,
    })
    size: number;

    @ApiProperty({
        description: 'The MIME type of the uploaded file',
        example: 'image/jpeg',
    })
    mimeType: string;

    @ApiProperty({
        description: 'The folder where the file is stored',
        example: 'products',
    })
    folder: string;

    @ApiProperty({
        description: 'The secure URL of the uploaded file',
        example: 'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/sample.jpg',
    })
    secureUrl: string;

    @ApiProperty({
        description: 'The width of the image (if applicable)',
        example: 1920,
        required: false,
    })
    width?: number;

    @ApiProperty({
        description: 'The height of the image (if applicable)',
        example: 1080,
        required: false,
    })
    height?: number;

    @ApiProperty({
        description: 'The format of the uploaded file',
        example: 'jpg',
    })
    format: string;
}
