"use client";

import { useState, useCallback } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { CldImage } from 'next-cloudinary';
import { Button } from './button';
import { Card } from './card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ value, onChange, className = "" }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback((result) => {
    if (result?.event === 'success') {
      onChange(result.info.secure_url);
      setIsUploading(false);
    }
  }, [onChange]);

  const handleRemove = useCallback(() => {
    onChange('');
  }, [onChange]);

  const handleOpen = useCallback(() => {
    setIsUploading(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsUploading(false);
  }, []);


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
              onClick={() => setIsUploading(true)}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Ganti Foto
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
          <CldUploadWidget
            uploadPreset="community-avatars"
            onUpload={handleUpload}
            onOpen={handleOpen}
            onClose={handleClose}
            options={{
              maxFiles: 1,
              resourceType: 'image',
              maxFileSize: 5000000,
              cropping: true,
              croppingAspectRatio: 1,
              folder: 'community-avatars',
              sources: ['local'],
              multiple: false,
              clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
              maxImageWidth: 2000,
              maxImageHeight: 2000,
              theme: 'minimal',
              singleUploadAutoClose: true,
              showAdvancedOptions: false,
              showSkipCropButton: false,
              showPoweredBy: false
            }}
          >
            {({ open }) => (
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
                  onClick={open}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? 'Mengupload...' : 'Pilih Foto'}
                </Button>
                <p className="text-xs text-gray-400 mt-2">
                  Format: JPG, PNG, WebP. Maksimal 5MB
                </p>
              </div>
            )}
          </CldUploadWidget>
        </Card>
      )}
    </div>
  );
};

export default ImageUpload;
