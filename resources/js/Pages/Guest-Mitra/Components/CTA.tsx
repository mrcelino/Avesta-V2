import { Link } from "@inertiajs/react";
export default function CallToActionSection() {
  return (
    <div className="mt-14 flex items-center justify-center">
      <div className="flex flex-col md:flex-row">
        <img
          alt="A person in a white coat standing in a poultry farm with chickens in the background"
          src="/image/mitratestimonials.jpeg"
          className="rounded-xl w-full md:w-1/2"
        />

        <div className="md:ml-20 md:w-1/2 mt-6 md:mt-0">
          <h2 className="text-3xl font-semibold text-pink mb-6">
            Ingin Tahu Lebih Lanjut?
          </h2>
          <p className="text-pink mb-6 leading-loose">
            Dapatkan informasi lebih lengkap dan mulailah manfaatkan layanan kami.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/register?mitra"
              className="bg-pink text-white font-semibold py-3 px-4 rounded-full text-center"
            >
              Daftar Sekarang
            </Link>
            <Link
              href="/mitra/about"
              className="border border-pink text-pink font-semibold py-2 px-4 rounded-full text-center"
            >
              Lihat Selengkapnya
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};