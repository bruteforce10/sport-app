"use client";

import { useState, useEffect  } from 'react';
import Image from 'next/image';
import { Download, Share2, MessageCircle, Instagram } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function ShareStoryModal({ isOpen, onClose, community }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [error, setError] = useState(null);



  const svgToPng = async (svgString) => {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new window.Image();
        
        canvas.width = 1080;
        canvas.height = 1920;
        
        img.onload = () => {
          try {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to convert canvas to blob'));
              }
            }, 'image/png', 0.95);
          } catch (error) {
            reject(error);
          }
        };
        
        img.onerror = (error) => {
          reject(new Error('Failed to load SVG: ' + error.message));
        };
        
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);
        img.src = url;
      } catch (error) {
        reject(error);
      }
    });
  };

  const generateStoryImage = async () => {
    if (!community) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        name: community.name,
        category: community.category,
        avatar: community.avatar || '',
        members: community.memberships.length,
        activityTags: community.activityTags,
      });
      
      const response = await fetch(`/api/communities/${community.id}/share-story?${params}&t=${Date.now()}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Failed to generate story image: ${response.status} ${response.statusText}`);
      }
      
      const svgString = await response.text();
      
      // Convert SVG to PNG
      const pngBlob = await svgToPng(svgString);
      const imageUrl = URL.createObjectURL(pngBlob);
      setGeneratedImageUrl(imageUrl);
    } catch (err) {
      console.error('Error generating story:', err);
      setError('Gagal membuat gambar story. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWhatsAppShare = () => {
    if (!generatedImageUrl) return;
    
    const shareText = `Lihat komunitas ${community.name} di Sport App! 🏃‍♂️`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleInstagramShare = () => {
    if (!generatedImageUrl) return;
    
    window.open(generatedImageUrl, '_blank');
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `${community.name}-story.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    if (generatedImageUrl) {
      URL.revokeObjectURL(generatedImageUrl);
      setGeneratedImageUrl(null);
    }
    setError(null);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      generateStoryImage();
    }
  }, [community, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Bagikan Story</DialogTitle>
          <DialogDescription>
            Buat dan bagikan story komunitas {community?.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">

          {isGenerating && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-custom mx-auto mb-4"></div>
              <p className="text-gray-600">Membuat gambar story...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-4">
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                onClick={generateStoryImage}
                variant="outline"
                className="w-full"
              >
                Coba Lagi
              </Button>
            </div>
          )}

          {generatedImageUrl && (
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <div className="aspect-[9/16] w-full max-w-[200px] mx-auto">
                  <Image
                    src={generatedImageUrl}
                    alt="Story Preview"
                    width={200}
                    height={355}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={handleWhatsAppShare}
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <MessageCircle className="w-6 h-6 mb-2 text-green-600" />
                  <span className="text-xs">WhatsApp</span>
                </Button>

                <Button
                  onClick={handleInstagramShare}
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <Instagram className="w-6 h-6 mb-2 text-pink-600" />
                  <span className="text-xs">Instagram</span>
                </Button>

                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <Download className="w-6 h-6 mb-2 text-blue-600" />
                  <span className="text-xs">Download</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
