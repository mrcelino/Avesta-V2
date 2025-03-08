import React from "react";

const Brand = () => {
  const brandsRow1 = [
    { src: "/image/tyson.png", alt: "Brand 1" },
    { src: "/image/japfa.png", alt: "Brand 2" },
    { src: "/image/tyson.png", alt: "Brand 3" },
    { src: "/image/japfa.png", alt: "Brand 4" },
  ];

  const brandsRow2 = [
    { src: "/image/churchs.png", alt: "Brand 6" },
    { src: "/image/cargill.png", alt: "Brand 7" },
    { src: "/image/churchs.png", alt: "Brand 9" },
    { src: "/image/cargill.png", alt: "Brand 8" },
  ];

  return (
    <div className="flex flex-col space-y-10 items-center justify-center w-full overflow-hidden border-2 rounded-3xl min-h-80 shadow-md p-12 bg-white">
      {/* Baris 1 - Bergerak ke kiri */}
      <div className="marquee-left">
        <div className="flex space-x-8">
          {brandsRow1.concat(brandsRow1, brandsRow1).map((brand, index) => (
            <img key={index} className="h-16" src={brand.src} alt={brand.alt} />
          ))}
        </div>
      </div>

      {/* Baris 2 - Bergerak ke kanan */}
      <div className="marquee-right mt-10">
        <div className="flex space-x-8">
          {brandsRow2.concat(brandsRow2, brandsRow2).map((brand, index) => (
            <img key={index} className="h-16" src={brand.src} alt={brand.alt} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Brand;
