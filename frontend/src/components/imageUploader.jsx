"use client";

import { useRef, useState } from "react";
import useIsSmallScreen from "@/hooks/useIsSmallScreen";
import Buttonrec from "./buttonrectangle";
import MobileEquipPic from "./MobileEquipPic";  // <-- import your new component

export default function ImageUploader() {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const isSmall = useIsSmallScreen();

  // Called when the user imports an image file
  const handleImageSelected = (dataUrl) => {
    setPreviewUrl(dataUrl);
  };

  // Called when the user takes a photo with their camera
  const handlePhotoTaken = (dataUrl) => {
    setPreviewUrl(dataUrl);
  };

  // Fallback button for desktop
  const handleDesktopUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-4">
      {isSmall ? (
        // On mobile: show the combined camera + import UI
        <MobileEquipPic
          onPhotoTaken={handlePhotoTaken}
          onImageSelected={handleImageSelected}
        />
      ) : (
        // On desktop: show your regular button
        <Buttonrec
          text="Attacher une image"
          onClick={handleDesktopUpload}
          className="w-full sm:w-auto px-4"
        />
      )}

      {/* Hidden input for desktop fallback */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => setPreviewUrl(ev.target.result);
          reader.readAsDataURL(file);
        }}
        className="hidden"
      />

      {/* Preview thumbnail */}
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-12 h-12 object-cover rounded shadow-md"
        />
      )}
    </div>
  );
}
