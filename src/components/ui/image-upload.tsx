'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  onUpload: (result: any) => void
  onDelete?: (publicId: string) => void
  currentImage?: string
  type?: 'profile' | 'organization' | 'document' | 'general'
  folder?: string
  userId?: string
  orgId?: string
  className?: string
  maxSize?: number // in MB
  acceptedTypes?: string[]
}

export default function ImageUpload({
  onUpload,
  onDelete,
  currentImage,
  type = 'general',
  folder = 'churchflow',
  userId,
  orgId,
  className = '',
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed types: ${acceptedTypes.join(', ')}`)
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File too large. Maximum size is ${maxSize}MB`)
      return
    }

    setError(null)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      formData.append('folder', folder)
      
      if (userId) formData.append('userId', userId)
      if (orgId) formData.append('orgId', orgId)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        onUpload(data.data)
        setPreview(null)
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch (error) {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!currentImage) return

    try {
      // Extract public_id from URL or use the URL directly
      const publicId = currentImage.includes('cloudinary.com') 
        ? currentImage.split('/').pop()?.split('.')[0] 
        : currentImage

      if (publicId) {
        const response = await fetch(`/api/upload?publicId=${publicId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          onDelete?.(publicId)
        }
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Image Display */}
      {currentImage && (
        <Card className="churchflow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={currentImage}
                  alt="Current image"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Current Image</p>
                <p className="text-xs text-gray-500">Click to replace or delete</p>
              </div>
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="churchflow-secondary"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      <Card className="churchflow-card">
        <CardContent className="p-6">
          <div className="text-center">
            {preview ? (
              <div className="space-y-4">
                <div className="relative w-32 h-32 mx-auto rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-gray-600">Preview of selected image</p>
                {uploading && (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600">Uploading...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {currentImage ? 'Replace Image' : 'Upload Image'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Click to select an image file
                  </p>
                </div>
                <Button
                  onClick={triggerFileInput}
                  disabled={uploading}
                  className="churchflow-primary"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Choose File'}
                </Button>
              </div>
            )}
          </div>

          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Upload Guidelines */}
          <div className="mt-4 text-xs text-gray-500">
            <p>Supported formats: JPEG, PNG, GIF, WebP</p>
            <p>Maximum file size: {maxSize}MB</p>
            {type === 'profile' && <p>Recommended size: 300x300px</p>}
            {type === 'organization' && <p>Recommended size: 200x200px</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
