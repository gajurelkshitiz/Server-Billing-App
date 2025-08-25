import React, { useState, useRef, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { LightBulbIcon } from "@heroicons/react/24/solid";

const templates = [
  { name: "Sales Entry", filename: "sales_entry_template.xlsx", description: "Template for importing sales entry.", logo: "sales_entry_logo.png" },
  { name: "Purchase Entry", filename: "purchase_entry_template.xlsx", description: "Template for importing purchase entry.", logo: "purchase_entry_logo.png" },
  { name: "Customer", filename: "customer_template.xlsx", description: "Template for importing customer data.", logo: "customer.png" },
  { name: "Supplier", filename: "supplier_template.xlsx", description: "Template for importing supplier data.", logo: "supplier.png" },
  { name: "Company", filename: "company_template.xlsx", description: "Template for importing company data.", logo: "company.png" },
  { name: "User", filename: "user_template.xlsx", description: "Template for importing user data.", logo: "user.png" },
];

const combinedTemplates = [
  {
    name: "All-In-One Import",
    filename: "combined_import_template.xlsx",
    description: "Includes multiple sheets for various imports in a single file.",
    logo: "combined_logo.png",
  },
];

const TemplateDownloadPage: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef(
    Autoplay({ 
      delay: 3000,
      stopOnInteraction: false, // Don't stop on manual navigation
      stopOnMouseEnter: true,   // Stop when mouse enters
    })
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setShowInstructions(false);
      }
    };

    if (showInstructions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showInstructions]);

  // Handle carousel hover state
  const handleCarouselMouseEnter = () => {
    setIsCarouselHovered(true);
    autoplayRef.current.stop();
  };

  const handleCarouselMouseLeave = () => {
    setIsCarouselHovered(false);
    autoplayRef.current.play();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 relative">
      <div className="max-w-7xl mx-auto relative">
        {/* 💡 Instructions Toggle Button */}
        <div className="absolute top-0 right-0 mt-2 mr-2 z-30">
          <button
            ref={buttonRef}
            onClick={() => setShowInstructions((prev) => !prev)}
            className="flex items-center gap-2 bg-yellow-100 border border-yellow-300 text-yellow-800 font-medium px-4 py-2 rounded-xl shadow hover:shadow-lg transition-all relative animate-pulse hover:animate-none"
          >
            <LightBulbIcon className="w-5 h-5 text-yellow-500" />
            <span className="hidden sm:inline">Instructions</span>
          </button>
        </div>

        {/* Instructions Popup */}
        {showInstructions && (
          <div
            ref={popupRef}
            className="absolute right-0 mt-2 w-[360px] bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-xl animate-fade-in z-50"
          >
            <h2 className="text-xl font-bold text-yellow-900 mb-4 text-center underline decoration-double">
              Before You Begin
            </h2>
            <ul className="list-disc list-inside text-yellow-800 space-y-2 text-sm">
              <li>Select the correct template matching your import type.</li>
              <li>Do not edit column headers or sheet names.</li>
              <li>Preserve included formulas and formats.</li>
              <li>Keep backups before uploading data.</li>
              <li>If you face issues, re-download the template and try again.</li>
              <li>For combined templates, only fill relevant sheets.</li>
            </ul>
          </div>
        )}

        {/* 🎯 Page Header */}
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-900">
          Templates
        </h1>
        <p className="text-center text-gray-600 mb-10 text-lg">
          Download Excel templates for importing data into the system.
        </p>

        {/* 🧾 Individual Templates */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Individual Import Templates
        </h2>

        {/* Carousel Container with Hover Detection */}
        <div 
          className="relative"
          onMouseEnter={handleCarouselMouseEnter}
          onMouseLeave={handleCarouselMouseLeave}
        >
          {/* Hover Indicator (Optional UX Enhancement) */}
          {isCarouselHovered && (
            <div className="absolute top-2 right-2 z-20 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm animate-fade-in">
              Auto-scroll paused
            </div>
          )}
          
          <Carousel 
            opts={{ 
              align: "start", 
              loop: true,
              skipSnaps: false,
              dragFree: false,
            }} 
            plugins={[autoplayRef.current]}
            className="w-full pl-4"
          >
            <CarouselContent className="overflow-visible pl-4 pr-4">
              {templates.map((template, index) => (
                <CarouselItem
                  key={template.name}
                  className="snap-start md:basis-1/4 lg:basis-1/4 p-3"
                >
                  <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center border border-transparent hover:bg-gray-100 hover:border-gray-500 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                    {/* Visual feedback when carousel is paused */}
                    <div className="flex items-center justify-center mb-3 relative" style={{ minHeight: "144px" }}>
                      {template.logo ? (
                        <img
                          src={`${import.meta.env.REACT_APP_BACKEND_IMAGE_URL}/uploads/all_templates/${template.logo}`}
                          alt={`${template.name} logo`}
                          className="w-36 h-36 object-contain transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement!.innerHTML = `<span class='text-3xl font-bold text-blue-700 flex items-center justify-center w-full h-full transition-transform duration-300 group-hover:scale-110'>${template.name
                              .split(" ")
                              .map((w) => w[0])
                              .join("")
                              .toUpperCase()}</span>`;
                          }}
                        />
                      ) : (
                        <span className="text-3xl font-bold text-blue-700 flex items-center justify-center w-full h-full transition-transform duration-300 group-hover:scale-110">
                          {template.name
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-500 text-center mb-4 flex-grow">
                      {template.description}
                    </p>
                    <a
                      href={`/uploads/all_templates/${template.filename}`}
                      download
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 font-medium shadow-sm hover:shadow-md transform hover:translate-y-[-1px] active:translate-y-0"
                      onClick={(e) => {
                        // Optional: Add download tracking or feedback
                        console.log(`Downloading ${template.name} template`);
                      }}
                    >
                      Download
                    </a>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Enhanced Navigation Buttons */}
            <CarouselPrevious className="hover:bg-blue-100 hover:border-blue-300 transition-colors" />
            <CarouselNext className="hover:bg-blue-100 hover:border-blue-300 transition-colors" />
          </Carousel>
          
          {/* Progress Indicator (Optional UX Enhancement) */}
          <div className="flex justify-center mt-4 space-x-2">
            {templates.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isCarouselHovered 
                    ? 'bg-gray-400' 
                    : 'bg-blue-600 animate-pulse'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 📦 Combined Templates Section */}
        <h2 className="text-2xl font-semibold mt-16 mb-6 text-gray-800">
          Combined Import Templates
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combinedTemplates.map((template) => (
            <div
              key={template.name}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center border border-transparent hover:bg-gray-100 hover:border-gray-500 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="mb-4 relative" style={{ minHeight: "144px" }}>
                {template.logo ? (
                  <img
                    src={`${import.meta.env.REACT_APP_BACKEND_IMAGE_URL}/uploads/all_templates/${template.logo}`}
                    alt={`${template.name} logo`}
                    className="w-36 h-36 object-contain transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement!.innerHTML = `<span class='text-3xl font-bold text-blue-700 flex items-center justify-center w-full h-full transition-transform duration-300 group-hover:scale-110'>${template.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()}</span>`;
                    }}
                  />
                ) : (
                  <span className="text-3xl font-bold text-blue-700 flex items-center justify-center w-full h-full transition-transform duration-300 group-hover:scale-110">
                    {template.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">
                {template.name}
              </h3>
              <p className="text-sm text-gray-500 text-center mb-4 flex-grow">
                {template.description}
              </p>
              <a
                href={`/uploads/all_templates/${template.filename}`}
                download
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 font-medium shadow-sm hover:shadow-md transform hover:translate-y-[-1px] active:translate-y-0"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateDownloadPage;
