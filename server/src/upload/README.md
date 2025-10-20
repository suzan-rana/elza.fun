# Upload API Documentation

This module provides image upload functionality using Cloudinary as the cloud storage service.

## Setup

1. Add your Cloudinary credentials to your `.env` file:
```env
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

2. The upload module is automatically registered in the main application.

## API Endpoints

### Upload Single Image
- **POST** `/upload/image`
- **Content-Type**: `multipart/form-data`
- **Body**: 
  - `file`: Image file (required)
  - `folder`: Optional folder name in Cloudinary (query parameter)

**Response:**
```json
{
  "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/sample.jpg",
  "publicId": "sample",
  "originalName": "sample.jpg",
  "size": 1024000,
  "mimeType": "image/jpeg"
}
```

### Upload Multiple Images
- **POST** `/upload/images`
- **Content-Type**: `multipart/form-data`
- **Body**: 
  - `files`: Array of image files (required, max 10)
  - `folder`: Optional folder name in Cloudinary (query parameter)

**Response:** Array of upload response objects

### Delete Image
- **DELETE** `/upload/image/:publicId`
- **Parameters**: `publicId` - The public ID of the image to delete

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

### Get Image Info
- **GET** `/upload/image/:publicId/info`
- **Parameters**: `publicId` - The public ID of the image

**Response:** Cloudinary image resource information

## Supported File Types
- JPEG/JPG
- PNG
- GIF
- WebP
- SVG

## File Size Limits
- Maximum file size: 10MB per file
- Maximum files per batch upload: 10 files

## Usage Example

```javascript
// Upload single image
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('/upload/image?folder=products', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
console.log('Image URL:', result.url);
```

## Error Handling

The API returns appropriate HTTP status codes:
- `201`: Upload successful
- `400`: Bad request (invalid file, size exceeded, etc.)
- `500`: Server error

All errors include descriptive messages to help with debugging.
