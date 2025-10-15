# Cloudinary Image Upload Integration Setup Guide

## Overview
This guide explains how to set up Cloudinary image upload functionality for ChurchFlow using the provided credentials.

## Provided Cloudinary Credentials
- **Cloud Name**: `df7zxiuxq`
- **API Key**: `694375151875773`
- **API Secret**: `H_49Pm6D97aSoHAoE7G4Gj0vIFI`

## Setup Steps

### 1. Environment Variables
Create a `.env.local` file in the root directory with the following content:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=df7zxiuxq
CLOUDINARY_API_KEY=694375151875773
CLOUDINARY_API_SECRET=H_49Pm6D97aSoHAoE7G4Gj0vIFI

# SendGrid Email Configuration
SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY
FROM_EMAIL=noreply@churchflow.com
FROM_NAME=ChurchFlow

# Google OAuth Configuration
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# Database (if using Prisma)
DATABASE_URL="file:./dev.db"

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Install Cloudinary Package
```bash
npm install cloudinary
```

### 3. Files Created/Modified

#### New Files:
- `src/lib/cloudinary-service.ts` - Cloudinary service utility
- `src/app/api/upload/route.ts` - Image upload API endpoint
- `src/components/ui/image-upload.tsx` - Reusable image upload component
- `setup-cloudinary.sh` - Setup script

#### Modified Files:
- `src/app/settings/page.tsx` - Added profile image upload

### 4. Image Upload Features

#### Upload Types:
- **Profile Images**: User profile pictures (300x300px, face detection)
- **Organization Logos**: Organization logos (200x200px, center crop)
- **Documents**: General document uploads
- **General**: Any image upload with custom settings

#### Image Processing:
- **Automatic Optimization**: Quality and format optimization
- **Responsive Images**: Multiple sizes for different devices
- **Thumbnail Generation**: Automatic thumbnail creation
- **Face Detection**: Smart cropping for profile images
- **Format Conversion**: Automatic WebP conversion for better performance

### 5. CloudinaryService Class Methods

```typescript
// Upload any image
await CloudinaryService.uploadImage(file, options)

// Upload profile image
await CloudinaryService.uploadProfileImage(file, userId)

// Upload organization logo
await CloudinaryService.uploadOrganizationLogo(file, orgId)

// Upload document
await CloudinaryService.uploadDocument(file, folder)

// Delete image
await CloudinaryService.deleteImage(publicId)

// Get transformed URL
CloudinaryService.getTransformedUrl(publicId, transformations)

// Get thumbnail URL
CloudinaryService.getThumbnailUrl(publicId, size)

// Get responsive URL
CloudinaryService.getResponsiveUrl(publicId, maxWidth)
```

### 6. ImageUpload Component Usage

```tsx
<ImageUpload
  type="profile"
  userId={user?.id}
  currentImage={profileImage}
  onUpload={(result) => setProfileImage(result.secure_url)}
  onDelete={() => setProfileImage(undefined)}
  className="max-w-md"
/>
```

#### Component Props:
- `type`: Upload type ('profile', 'organization', 'document', 'general')
- `userId`: User ID for profile images
- `orgId`: Organization ID for logos
- `currentImage`: Current image URL
- `onUpload`: Callback when upload succeeds
- `onDelete`: Callback when image is deleted
- `folder`: Custom folder name
- `maxSize`: Maximum file size in MB
- `acceptedTypes`: Allowed file types

### 7. API Endpoints

#### Upload Image
```http
POST /api/upload
Content-Type: multipart/form-data

file: [File]
type: profile|organization|document|general
folder: string (optional)
userId: string (for profile images)
orgId: string (for organization logos)
```

#### Delete Image
```http
DELETE /api/upload?publicId=image_public_id
```

#### Get Image URL
```http
GET /api/upload?publicId=image_public_id&transformations={...}
```

### 8. Testing Image Upload

#### Test Profile Image Upload:
1. Start the development server: `npm run dev`
2. Navigate to Settings > Profile
3. Click "Choose File" in the Profile Picture section
4. Select an image file
5. Verify the image uploads and displays correctly

#### Test Other Upload Types:
- Organization logos in organization management
- Document uploads in various forms
- General image uploads

### 9. Cloudinary Dashboard

#### Account Management:
- Monitor storage usage
- View upload statistics
- Manage transformations
- Set up webhooks
- Configure security settings

#### Media Library:
- Browse uploaded images
- Manage folders and tags
- View image details
- Delete unused images

### 10. Image Optimization Features

#### Automatic Optimizations:
- **Quality**: Auto quality adjustment
- **Format**: Automatic WebP conversion
- **Size**: Responsive sizing
- **Compression**: Lossless compression

#### Transformations:
- **Resize**: Width/height adjustments
- **Crop**: Smart cropping with face detection
- **Gravity**: Positioning for crops
- **Effects**: Filters and enhancements

### 11. Security Considerations

#### Upload Security:
- File type validation
- File size limits
- Virus scanning (if enabled)
- Access control

#### URL Security:
- Signed URLs for private images
- Token-based access
- Expiration times
- Domain restrictions

### 12. Performance Optimization

#### Image Delivery:
- **CDN**: Global content delivery
- **Caching**: Browser and CDN caching
- **Compression**: Automatic compression
- **Lazy Loading**: On-demand loading

#### Best Practices:
- Use appropriate image sizes
- Optimize images before upload
- Implement lazy loading
- Use WebP format when possible

### 13. Folder Structure

#### Default Folders:
- `churchflow/profiles/` - User profile images
- `churchflow/organizations/` - Organization logos
- `churchflow/documents/` - Document uploads
- `churchflow/general/` - General uploads

#### Naming Convention:
- Profile: `profile_{userId}_{timestamp}`
- Organization: `logo_{orgId}_{timestamp}`
- Documents: `doc_{timestamp}`
- General: `img_{timestamp}`

### 14. Error Handling

#### Common Errors:
- **File too large**: Exceeds size limit
- **Invalid format**: Unsupported file type
- **Upload failed**: Network or server error
- **Delete failed**: Image not found or access denied

#### Error Recovery:
- Retry mechanisms
- User-friendly error messages
- Fallback options
- Logging for debugging

### 15. Production Deployment

#### Environment Variables:
```env
CLOUDINARY_CLOUD_NAME=your-production-cloud-name
CLOUDINARY_API_KEY=your-production-api-key
CLOUDINARY_API_SECRET=your-production-api-secret
```

#### Security Settings:
- Enable signed uploads
- Set up webhook notifications
- Configure access restrictions
- Monitor usage and costs

### 16. Troubleshooting

#### Common Issues:

**"Upload failed"**
- Check Cloudinary credentials
- Verify file size and type
- Check network connectivity

**"Image not displaying"**
- Verify image URL
- Check CORS settings
- Ensure image is public

**"Slow uploads"**
- Optimize image size
- Check network speed
- Consider compression

**"Storage quota exceeded"**
- Clean up unused images
- Upgrade Cloudinary plan
- Implement cleanup policies

### 17. Monitoring and Analytics

#### Cloudinary Analytics:
- Upload statistics
- Bandwidth usage
- Transformation usage
- Error rates

#### Custom Tracking:
- Track upload success rates
- Monitor user engagement
- Analyze image usage patterns
- Optimize based on data

## Support

If you encounter any issues with Cloudinary integration:
1. Check Cloudinary dashboard for account status
2. Verify environment variables
3. Test with different image types and sizes
4. Check browser console for errors
5. Review Cloudinary documentation
