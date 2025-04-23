import { useRef } from 'react';
import Cloud from "../assets/Cloud.svg";

export default function ImportPic({ onImageSelected }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onImageSelected?.({
        file,                   
        dataUrl: event.target.result,
        name: file.name,
        size: file.size,
        type: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div 
        className="relative flex items-center justify-center rounded-xl bg-white shadow-md hover:shadow-lg w-12 h-12 lg:min-w-[47px] cursor-pointer"
        onClick={handleClick}
        title="Select photo from gallery"
      >
        <img src={Cloud} alt="Import from gallery" className="w-4 h-4" />
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          multiple={false} // Single file selection only
        />
      </div>
    </>
  );
}