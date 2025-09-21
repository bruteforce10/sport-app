"use client";

import { useState, useRef } from 'react';
import { CldImage } from 'next-cloudinary';
import { Button } from './button';
import { Card } from './card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const SimpleImageUpload = ({ value, onChange, className = "" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setUploadError('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      // Check if Cloudinary cloud name is available
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) {
        throw new Error('Cloudinary cloud name not configured');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'active'); // Use existing preset
      formData.append('folder', 'community-avatars');
      
      // Add additional parameters for better compatibility
      formData.append('overwrite', 'true');
      formData.append('unique_filename', 'true');

      console.log('Uploading to Cloudinary:', {
        cloudName,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Upload failed:', response.status, errorData);
        
        // If preset not found, try without preset
        if (errorData.error?.message?.includes('preset not found')) {
          console.log('Trying upload without preset...');
          return await uploadWithoutPreset(file, cloudName);
        }
        
        throw new Error(`Upload failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      onChange(result.secure_url);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    setUploadError('');
  };

  const uploadWithoutPreset = async (file, cloudName) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'community-avatars');
      formData.append('overwrite', 'true');
      formData.append('unique_filename', 'true');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Upload failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('Upload successful (without preset):', result);
      onChange(result.secure_url);
    } catch (error) {
      console.error('Upload without preset failed:', error);
      throw error;
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      {value ? (
        <Card className="relative p-4">
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <CldImage
              src={value}
              width="400"
              height="300"
              alt="Community avatar"
              className="w-full h-full object-cover"
              crop={{
                type: 'auto',
                source: true
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-2 text-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClick}
              disabled={isUploading}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Ganti Foto'}
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Avatar Komunitas
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Pilih foto untuk avatar komunitas Anda
            </p>
            <Button
              type="button"
              onClick={handleClick}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? 'Mengupload...' : 'Pilih Foto'}
            </Button>
            <p className="text-xs text-gray-400 mt-2">
              Format: JPG, PNG, WebP. Maksimal 5MB
            </p>
            {uploadError && (
              <p className="text-sm text-red-500 mt-2">{uploadError}</p>
            )}
          </div>
        </Card>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default SimpleImageUpload;
