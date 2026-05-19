# Supabase Storage Setup Guide

## Create Storage Buckets for Media Uploads

The application now supports uploading images directly to Supabase Storage. Follow these steps to set up the required storage buckets:

### 1. Create Upashray Media Bucket

1. Log in to your Supabase dashboard
2. Navigate to **Storage** → **Buckets**
3. Click **Create a new bucket**
4. Name it: `upashray-media`
5. Uncheck "Private bucket" to make it **public**
6. Click **Create bucket**

### 2. Create Jinalaya Media Bucket

1. Click **Create a new bucket** again
2. Name it: `jinalaya-media`
3. Uncheck "Private bucket" to make it **public**
4. Click **Create bucket**

### 3. Verify Bucket Configuration

Each bucket should have:
- ✅ Public access enabled (so images can be viewed without authentication)
- ✅ Proper bucket name matching the code references:
  - `upashray-media` - for upashray images
  - `jinalaya-media` - for jinalaya images

## How File Uploads Work

When you upload images through the admin panel:

1. **File Selection**: Select one or more image files for each phase (Before, In Process, After)
2. **Upload Process**: 
   - Files are uploaded to the appropriate Supabase Storage bucket
   - File names are prefixed with metadata: `upashray-{id}-{phase}-{timestamp}-{filename}`
   - Example: `upashray-123-before-1621234567890-photo.jpg`
3. **Database Storage**: 
   - The public URL of each uploaded file is stored in the `upashray_media` table
   - The `media_type` field stores the phase: 'before', 'process', or 'after'
   - Images are sorted by `sort_order` field

## Supported File Types

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)

## Image Best Practices

- **Resolution**: 1200x800 pixels or higher for best quality
- **File Size**: Keep under 5MB per image
- **Format**: PNG for graphics, JPEG for photos

## Troubleshooting

### "Row-Level Security Policy" Error
**Error message**: `new row violates row-level security policy`

This means the storage bucket has RLS policies that are blocking uploads.

**Fix:**
1. Go to Supabase Dashboard → **Storage** → **Buckets**
2. Click on `upashray-media` bucket
3. Go to **Policies** tab
4. Disable restrictive RLS policies:
   - Either click the menu on existing policies and select "Disable RLS"
   - Or create a new policy:
     - **Name**: `Allow authenticated uploads`
     - **Operations**: SELECT, INSERT, UPDATE, DELETE
     - **Target roles**: authenticated
5. Leave "Using expression" and "With check expression" blank
6. Repeat for `jinalaya-media` bucket

**SQL Alternative** (run in SQL Editor):
```sql
-- Option 1: Disable RLS completely (simpler for public buckets)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Option 2: Create permissive policies (if you need RLS)
CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'upashray-media');

CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'upashray-media');
```

### "Upload Failed" Error
- Check that the storage bucket exists and is public
- Verify file size is under the limit
- Check browser console for specific error messages
- Ensure RLS policies are not blocking uploads (see above)

### Images Not Showing
- Ensure bucket is public (not private)
- Check that the file URL is correctly stored in the database
- Verify image file format is supported

### Storage Quota Issues
- Check your Supabase project's storage quota
- Delete unused images if quota is exceeded

## Environment Variables

Make sure your `.env` file contains the required Supabase configuration:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Database Tables

The media files are linked through these tables:
- **upashray_media**: Stores metadata about uploaded images for upashrays
  - Fields: id, upashray_id, media_type, file_url, alt_text, sort_order, created_at, updated_at

- **jinalaya_media** (future): For jinalaya images (optional)

## Security Considerations

- Public buckets allow anyone to view images
- To restrict access, configure Row Level Security (RLS) policies in Supabase
- Admin panel login is required to upload new files
