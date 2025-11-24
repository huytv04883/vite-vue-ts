import { END_POINT } from '@/constants/endpoint';

export const handleUploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET_NAME);

  const response = await fetch(END_POINT.UPLOAD_IMAGE_CLOUDINARY, {
    method: 'POST',
    body: formData,
  });
  alert(JSON.stringify(response));
  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();
  return data.secure_url;
};
