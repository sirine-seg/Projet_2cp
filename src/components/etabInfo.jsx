import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const EstablishmentInfoSection = ({ initialData }) => {
  const {
    register,
    formState: { errors },
  } = useForm();
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      if (initialData.logoUrl) {
        setLogoPreview(initialData.logoUrl);
      }
    }
  }, [initialData]);

  return (
    <div className="py-6 px-2 max-w-4xl mx-auto">
      <div className="space-y-8">
        {/* Establishment Details */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-[#202124]">
            Establissement Details
          </h3>

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#202124] mb-1"
            >
              Nom
            </label>
            <div className="w-full px-4 py-3 border rounded-lg border-gray-300 bg-gray-50">
              {initialData?.name || "N/A"}
            </div>
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-[#202124] mb-1"
            >
              Address
            </label>
            <div className="w-full px-4 py-2 border rounded-lg border-gray-300 bg-gray-50">
              {initialData?.address || "N/A"}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 my-8"></div>

        {/* Contact Information */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-[#202124]">
            Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-[#202124] mb-1"
              >
                Tél
              </label>
              <div className="w-full px-4 py-3 border rounded-lg border-gray-300 bg-gray-50">
                {initialData?.phone || "N/A"}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#202124] mb-1"
              >
                Email
              </label>
              <div className="w-full px-4 py-3 border rounded-lg border-gray-300 bg-gray-50">
                {initialData?.email || "N/A"}
              </div>
            </div>
          </div>

          {/* Website */}
          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-[#202124] mb-1"
            >
              Site
            </label>
            <div className="w-full px-4 py-3 border rounded-lg border-gray-300 bg-gray-50">
              {initialData?.website || "N/A"}
            </div>
          </div>
        </div>

        {/* Logo Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-[#202124]">Logo</h3>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/2">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 flex flex-col items-center justify-center">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="max-h-64 w-auto object-contain"
                  />
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-gray-400 space-y-2">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>No logo available</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 my-8"></div>
      </div>
    </div>
  );
};

export default EstablishmentInfoSection;