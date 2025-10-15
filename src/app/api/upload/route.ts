import { NextRequest, NextResponse } from 'next/server'
import CloudinaryService from '@/lib/cloudinary-service'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'general'
    const folder = formData.get('folder') as string || 'churchflow'
    const userId = formData.get('userId') as string
    const orgId = formData.get('orgId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    let result

    // Convert File to Buffer for Cloudinary
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload based on type
    switch (type) {
      case 'profile':
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required for profile images' },
            { status: 400 }
          )
        }
        result = await CloudinaryService.uploadProfileImage(buffer, userId)
        break

      case 'organization':
        if (!orgId) {
          return NextResponse.json(
            { error: 'Organization ID is required for organization logos' },
            { status: 400 }
          )
        }
        result = await CloudinaryService.uploadOrganizationLogo(buffer, orgId)
        break

      case 'document':
        result = await CloudinaryService.uploadDocument(buffer, folder)
        break

      default:
        result = await CloudinaryService.uploadImage(buffer, { folder })
    }

    return NextResponse.json({
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        thumbnail_url: CloudinaryService.getThumbnailUrl(result.public_id),
        responsive_url: CloudinaryService.getResponsiveUrl(result.public_id),
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      }
    })

  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      )
    }

    const success = await CloudinaryService.deleteImage(publicId)

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Image deleted successfully'
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to delete image' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Image delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')
    const transformations = searchParams.get('transformations')

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      )
    }

    let url
    if (transformations) {
      const transformOptions = JSON.parse(transformations)
      url = CloudinaryService.getTransformedUrl(publicId, transformOptions)
    } else {
      url = CloudinaryService.getResponsiveUrl(publicId)
    }

    return NextResponse.json({
      success: true,
      url
    })

  } catch (error) {
    console.error('Get image URL error:', error)
    return NextResponse.json(
      { error: 'Failed to get image URL' },
      { status: 500 }
    )
  }
}
