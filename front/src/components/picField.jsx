import { useState } from "react";
import Pic from "../assets/Pic.svg";

export default function PicField() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  return (
    <div className="flex justify-center items-center w-full py-4">
      <label
        htmlFor="imageUpload"
        className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 bg-[#D9D9D9] flex items-center justify-center rounded-2xl cursor-pointer"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <img
            src={Pic}
            alt="Pic"
            className="w-3 h-3 sm:w-6 sm:h-6"
          />
        )}
      </label>
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}