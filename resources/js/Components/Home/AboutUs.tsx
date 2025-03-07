export default function AboutUs() {
  return (
    <div className="w-full mx-auto mt-10 sm:mt-20 h-auto md:h-[350px] flex flex-col md:flex-row justify-center rounded-3xl overflow-hidden">
      {/* Left Section */}
      <div className="bg-pink w-full md:w-4/6 p-6 sm:p-12 md:p-16 flex flex-col justify-center">
        <h1 className="text-white font-bold mb-4 sm:mb-6 text-3xl sm:text-5xl">Avesta</h1>
        <p className="text-white text-xs sm:text-sm md:text-lg leading-relaxed font-semibold">
          Avesta adalah sistem informasi pencarian unggas berbasis marketplace yang dirancang untuk mempermudah pembelian ayam potong di tingkat kecamatan. Sistem ini memungkinkan pemilik warung untuk mempromosikan ayam potong mereka, dan pembeli untuk mencari serta memesan secara online.
        </p>
        {/* Mobile Image - Hidden on larger screens */}
        <div className="md:hidden flex justify-center mt-4">
          <img src="/image/Hero.png" alt="Illustration" className="w-[150px] h-[100px] object-contain" />
        </div>
      </div>
      {/* Right Section - Hidden on mobile */}
      <div className="hidden md:flex bg-[#FF9FAD] w-2/6 justify-center items-center">
        <img src="/image/Hero.png" alt="Illustration" className="w-[250px] h-[200px] object-contain" />
      </div>
    </div>
  );
}