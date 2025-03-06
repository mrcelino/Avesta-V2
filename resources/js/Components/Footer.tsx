export default function Footer(){
  return(
    <footer className="bg-pink py-8">
      <div className="flex justify-between items-start text-white mx-10 space-x-10">
        <div>
          <img className="text-4xl font-bold mb-4" src="/image/avesta2.png" alt="Avesta Logo" />
          <p className="text-lg font-medium">
            Jl. Yacaranda, Sekip Unit IV, Kec. Depok,<br />
            Kabupaten Sleman, Daerah Istimewa<br />
            Yogyakarta 55281
          </p>
        </div>
        <div className="flex-1 mt-8">
          <p className="text-2xl font-semibold mb-4">
            Belanja ayam potong jadi lebih mudah,<br /> cukup lewat Avesta!
          </p>
          <p className="text-lg">Temukan penjual, harga bersaing, dan transaksi praktis setiap hari.</p>
        </div>
        <div className="flex space-x-16 items-start mt-8">
          <div>
            <p className="text-lg font-semibold mb-4">Tentang Avesta</p>
            <p className="text-lg mb-2">Syarat dan Ketentuan</p>
            <p className="text-lg mb-2">Kebijakan dan Privasi</p>
            <p className="text-lg">FAQ</p>
          </div>
          <div>
            <p className="text-lg font-semibold mb-4">Ikuti Kami</p>
            <div className="flex space-x-4">
              <a href="#">
                <img src="/image/facebook.png" alt="Facebook Icon" className="h-6 w-6" />
              </a>
              <a href="#">
                <img src="/image/twt.png" alt="Twitter Icon" className="h-6 w-6" />
              </a>
              <a href="#">
                <img src="/image/instagram.png" alt="Instagram Icon" className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <hr className="mx-10 mt-10 border-white" />
      <div className="text-center mt-10">
        <p className="text-lg text-white">© 2024 Avesta, All rights reserved</p>
      </div>
    </footer>

  )
}