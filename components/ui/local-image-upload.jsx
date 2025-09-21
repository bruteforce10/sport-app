"use client";

import { useState, useRef } from 'react';
import { Button } from './button';
import { Card } from './card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

const LocalImageUpload = ({ value, onChange, className = "" }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(value || '');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
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

    setUploadError('');
    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Pass the file object to parent component instead of URL
    onChange(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadError('');
    onChange(null);
    
    // Clean up preview URL
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      {previewUrl ? (
        <Card className="relative p-4">
          <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden">
            <Image
              width={192}
              height={192}
              src={previewUrl}
              alt="Community avatar preview"
              className="aspect-square object-cover"
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
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Ganti Foto
            </Button>
          </div>
          {selectedFile && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              File: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </Card>
      ) : (
        <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Upload Avatar Komunitas
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Pilih foto untuk avatar komunitas Anda
            </p>
            <Button
              type="button"
              onClick={handleClick}
              className="w-full bg-green-700 hover:bg-green-800"
            >
              Pilih Foto
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

export default LocalImageUpload;
