# Cloudinary Setup Guide

## 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com) and create a free account
2. After signing up, you'll see your dashboard with credentials

## 2. Get Your Credentials
From your Cloudinary dashboard, copy these values:
- **Cloud Name** (e.g., `your-cloud-name`)
- **API Key** (e.g., `123456789012345`)
- **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

## 3. Set Up Environment Variables
Create a `.env.local` file in your project root and add:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## 4. Create Upload Preset
1. Go to your Cloudinary dashboard
2. Navigate to **Settings** → **Upload**
3. Scroll down to **Upload presets**
4. Click **Add upload preset**
5. Set these values:
   - **Preset name**: `community-avatars`
   - **Signing Mode**: `Unsigned`
   - **Folder**: `community-avatars`
   - **Resource Type**: `Image`
   - **Transformations**: 
     - **Crop**: `Auto`
     - **Quality**: `Auto`
     - **Format**: `Auto`
6. Click **Save**

## 5. Test the Upload
1. Start your development server: `npm run dev`
2. Go to the community creation page
3. Try uploading an image - it should work without errors!

## Troubleshooting

### "auth required" Error
- Make sure your environment variables are correctly set
- Verify the upload preset name matches exactly: `community-avatars`
- Check that the upload preset is set to "Unsigned"

### DataCloneError
- **FIXED**: Now using a simpler direct upload approach instead of the upload widget
- The new `SimpleImageUpload` component uses direct API calls to avoid this error

### 400 Bad Request
- Check that your Cloudinary credentials are correctly set in `.env.local`
- Verify the upload preset exists and is configured properly
- Ensure the folder name matches in both the preset and component

### Upload Not Working
- Make sure `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set correctly
- Check browser console for any error messages
- Verify the upload preset is set to "Unsigned" mode
