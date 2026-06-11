import { supabase } from './supabaseClient';

export const storageService = {
  async compressImage(file: File, maxWidth: number = 1000, quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas context failed'));

          const width = Math.min(img.width, maxWidth);
          const height = (width / img.width) * img.height;

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Compression failed'));
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => reject(new Error('Image load failed'));
      };
      reader.onerror = () => reject(new Error('File read failed'));
    });
  },

  async uploadBookingPhoto(bookingId: string, file: File): Promise<string> {
    try {
      // Validate file type
      const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validMimeTypes.includes(file.type)) {
        throw new Error('Only JPEG, PNG, and WebP images are allowed');
      }

      // Validate file size (max 5MB)
      const maxSizeBytes = 5 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        throw new Error('File size must be less than 5MB');
      }

      // Validate booking ID is UUID format
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(bookingId)) {
        throw new Error('Invalid booking ID');
      }

      const compressed = await this.compressImage(file);
      const fileName = `bookings/${bookingId}/${Date.now()}.jpg`;

      const { data, error } = await supabase.storage
        .from('booking-photos')
        .upload(fileName, compressed, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const { data: publicData } = supabase.storage.from('booking-photos').getPublicUrl(data.path);
      return publicData.publicUrl;
    } catch (err) {
      throw new Error(`Photo upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  },

  async deletePhoto(photoUrl: string): Promise<void> {
    try {
      const fileName = photoUrl.split('/').pop();
      if (!fileName) throw new Error('Invalid photo URL');

      const { error } = await supabase.storage.from('booking-photos').remove([`bookings/*/${fileName}`]);

      if (error) throw error;
    } catch (err) {
      console.error('Photo deletion failed:', err);
    }
  },
};
