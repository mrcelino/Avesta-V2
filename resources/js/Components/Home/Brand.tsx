import React from "react";

const Brand = () => {
  const brandsRow1 = [
    { src: "/image/tyson.png", alt: "Brand 1" },
    { src: "/image/japfa.png", alt: "Brand 2" },
    { src: "/image/tyson.png", alt: "Brand 3" },
    { src: "/image/japfa.png", alt: "Brand 4" },
    { src: "/image/tyson.png", alt: "Brand 5" },
  ];

  const brandsRow2 = [
    { src: "/image/cargill.png", alt: "Brand 6" },
    { src: "/image/churchs.png", alt: "Brand 7" },
    { src: "/image/cargill.png", alt: "Brand 8" },
    { src: "/image/churchs.png", alt: "Brand 9" },
    { src: "/image/cargill.png", alt: "Brand 10" },
  ];

  const brandsMobile = [
    { src: "/image/tyson.png", alt: "Brand 1" },
    { src: "/image/japfa.png", alt: "Brand 2" },
    { src: "/image/churchs.png", alt: "Brand 3" },
    { src: "/image/cargill.png", alt: "Brand 4" },
  ];

  return (
    <>
      {/* Desktop Version */}
      <div
        className="hidden md:block items-center w-full border-2 rounded-3xl h-auto md:h-[415px] shadow-md overflow-hidden p-12"
      >
        {/* Baris 1 (bergerak ke kiri) */}
        <div className="flex left-slider mt-4 md:mt-0">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {brandsRow1.map((brand, index) => (
              <img
                key={index}
                className="mt-8 flex justify-center items-center"
                src={brand.src}
                alt={brand.alt}
              />
            ))}
          </div>
        </div>

        {/* Baris 2 (bergerak ke kanan) */}
        <div className="flex right-slider space-x-4 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {brandsRow2.map((brand, index) => (
              <img
                key={index}
                className="mt-8 flex justify-center items-center"
                src={brand.src}
                alt={brand.alt}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div
        className="md:hidden grid grid-cols-1 gap-4 border-2 rounded-3xl"
      >
        {brandsMobile.map((brand, index) => (
          <img
            key={index}
            className="mt-8 flex justify-center items-center"
            src={brand.src}
            alt={brand.alt}
          />
        ))}
      </div>
    </>
  );
};

export default Brand;
