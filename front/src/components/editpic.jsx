import { useState, useEffect } from "react";

export default function editPic({ equipement, setSelectedImage }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // Clean up the preview URL when the component unmounts
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file); // Update the parent component's state
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    } else {
      setPreviewUrl(null); // Clear preview if no file selected
    }
  };

  return (
    <div className="flex justify-center items-center w-full sm:w-1/2 py-4">
      <label
        htmlFor="imageUpload"
        className="w-48 h-48 bg-gray-300 flex items-center justify-center rounded border cursor-pointer overflow-hidden"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover rounded"
          />
        ) : equipement?.image ? (
          <img
            src={
              equipement.image.startsWith("http")
                ? equipement.image
                : `http://127.0.0.1:8000/equip_imges/${equipement.image}`
            }
            alt="Équipement"
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <p className="text-gray-700">Image</p>
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