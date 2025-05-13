import { useRef, useState } from 'react';
import Camera from "../assets/Camera.svg";
import Cloud from "../assets/Cloud.svg";

export default function MobileEquipPic({ onPhotoTaken, onImageSelected }) {
  const fileInputRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);

  // 1. Handle Import (unchanged from your original)
  const handleImport = () => fileInputRef.current?.click();

  // 2. Handle Camera (mobile-only)
  const handleCamera = async () => {
    if (!/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      alert("Please use a mobile device");
      return;
    }

    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      videoRef.current.srcObject = stream;
    } catch (err) {
      alert(`Camera error: ${err.message}`);
      setIsCameraActive(false);
    }
  };

  // 3. Capture Photo
  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    onPhotoTaken?.(canvas.toDataURL('image/jpeg'));
    closeCamera();
  };

  // 4. Cleanup
  const closeCamera = () => {
    videoRef.current?.srcObject?.getTracks().forEach(track => track.stop());
    setIsCameraActive(false);
  };

  return (
    <div className="bg-white rounded-3xl p-4 w-full max-w-[280px] shadow-xs">
      {/* Original Buttons - NO CHANGES */}
      <div className="flex flex-col space-y-3">
        <button 
          onClick={handleCamera}
          className="bg-[#F4F4F4] p-3 rounded-lg flex items-center justify-between"
        >
          <span className="text-[#80868B] text-sm font-medium">
            Prendre une photo
          </span>
          <img src={Camera} alt="Camera" className="w-5 h-5" />
        </button>

        <button 
          onClick={handleImport}
          className="bg-[#F4F4F4] p-3 rounded-lg flex items-center justify-between"
        >
          <span className="text-[#80868B] text-sm font-medium">
            Importer une image
          </span>
          <img src={Cloud} alt="Cloud" className="w-5 h-5" />
        </button>
      </div>

      {/* Hidden Elements */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file?.type.startsWith('image/')) return;
          const reader = new FileReader();
          reader.onload = (e) => onImageSelected?.(e.target.result);
          reader.readAsDataURL(file);
        }}
        accept="image/*"
        className="hidden"
      />

      {/* Camera Overlay (zero layout impact) */}
      {isCameraActive && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain"/>
          <div className="absolute bottom-4 flex gap-4">
            <button 
              onClick={capturePhoto} 
              className="bg-white rounded-full w-14 h-14 border-4 border-gray-200"
            />
            <button 
              onClick={closeCamera}
              className="bg-red-500 text-white px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}