import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'df7zxiuxq',
  api_key: process.env.CLOUDINARY_API_KEY || '694375151875773',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'H_49Pm6D97aSoHAoE7G4Gj0vIFI',
  secure: true
})

export interface UploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  bytes: number
}

export interface UploadOptions {
  folder?: string
  transformation?: any
  quality?: string | number
  format?: string
  width?: number
  height?: number
  crop?: string
  gravity?: string
  public_id?: string
}

export class CloudinaryService {
  /**
   * Upload an image to Cloudinary
   */
  static async uploadImage(
    file: File | Buffer | string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      const uploadOptions = {
        folder: options.folder || 'churchflow',
        quality: options.quality || 'auto',
        format: options.format || 'auto',
        transformation: options.transformation || [],
        ...options
      }

      const result = await cloudinary.uploader.upload(file as any, uploadOptions)
      
      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      throw new Error('Failed to upload image')
    }
  }

  /**
   * Upload a user profile image
   */
  static async uploadProfileImage(file: File | Buffer | string, userId: string): Promise<UploadResult> {
    return this.uploadImage(file, {
      folder: 'churchflow/profiles',
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ],
      public_id: `profile_${userId}_${Date.now()}`
    })
  }

  /**
   * Upload an organization logo
   */
  static async uploadOrganizationLogo(file: File | Buffer | string, orgId: string): Promise<UploadResult> {
    return this.uploadImage(file, {
      folder: 'churchflow/organizations',
      transformation: [
        { width: 200, height: 200, crop: 'fill', gravity: 'center' },
        { quality: 'auto', fetch_format: 'auto' }
      ],
      public_id: `logo_${orgId}_${Date.now()}`
    })
  }

  /**
   * Upload a document or file
   */
  static async uploadDocument(file: File | Buffer | string, folder: string = 'churchflow/documents'): Promise<UploadResult> {
    return this.uploadImage(file, {
      folder,
      quality: 'auto',
      format: 'auto'
    })
  }

  /**
   * Delete an image from Cloudinary
   */
  static async deleteImage(publicId: string): Promise<boolean> {
    try {
      await cloudinary.uploader.destroy(publicId)
      return true
    } catch (error) {
      console.error('Cloudinary delete error:', error)
      return false
    }
  }

  /**
   * Generate a transformed image URL
   */
  static getTransformedUrl(publicId: string, transformations: any = {}): string {
    return cloudinary.url(publicId, {
      ...transformations,
      secure: true
    })
  }

  /**
   * Generate a thumbnail URL
   */
  static getThumbnailUrl(publicId: string, size: number = 150): string {
    return cloudinary.url(publicId, {
      width: size,
      height: size,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto',
      fetch_format: 'auto',
      secure: true
    })
  }

  /**
   * Generate a responsive image URL
   */
  static getResponsiveUrl(publicId: string, maxWidth: number = 800): string {
    return cloudinary.url(publicId, {
      width: maxWidth,
      crop: 'scale',
      quality: 'auto',
      fetch_format: 'auto',
      secure: true
    })
  }

  /**
   * Upload multiple images
   */
  static async uploadMultipleImages(
    files: (File | Buffer | string)[],
    options: UploadOptions = {}
  ): Promise<UploadResult[]> {
    try {
      const uploadPromises = files.map(file => this.uploadImage(file, options))
      return await Promise.all(uploadPromises)
    } catch (error) {
      console.error('Multiple upload error:', error)
      throw new Error('Failed to upload images')
    }
  }

  /**
   * Get image information
   */
  static async getImageInfo(publicId: string): Promise<any> {
    try {
      return await cloudinary.api.resource(publicId)
    } catch (error) {
      console.error('Get image info error:', error)
      throw new Error('Failed to get image information')
    }
  }

  /**
   * Create a signed upload preset for client-side uploads
   */
  static createUploadPreset(options: any = {}): any {
    return {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'df7zxiuxq',
      upload_preset: options.preset || 'churchflow_default',
      folder: options.folder || 'churchflow',
      ...options
    }
  }
}

export default CloudinaryService
