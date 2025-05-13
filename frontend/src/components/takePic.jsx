import { useRef } from 'react';
import Camera from "../assets/Camera.svg";

export default function TakePic({ onImageSelected }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (onImageSelected) {
        onImageSelected(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div 
        className="relative flex items-center justify-center rounded-xl bg-white shadow-md hover:shadow-lg w-12 h-12 lg:min-w-[47px] cursor-pointer"
        onClick={handleClick}
        title="Import photo from device"
      >
<img src={Camera} alt="Camera" className="w-4 h-4" />        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          capture="environment" // Helps with mobile file selection
        />
      </div>
    </>
  );
}