import { END_POINT } from '@/constants/endpoint';

export const handleUploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET_NAME);
  alert('File: ' + file);
  alert('Size: ' + file.size);
  alert('Type: ' + file.type);
  alert(END_POINT.UPLOAD_IMAGE_CLOUDINARY);
  const response = await fetch(END_POINT.UPLOAD_IMAGE_CLOUDINARY, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error.message || 'Image upload failed');
  }

  const data = await response.json();
  return data.secure_url;
};
