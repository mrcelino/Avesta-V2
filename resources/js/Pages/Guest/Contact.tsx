import React from "react";
import GuestLayout from "../../Layouts/GuestLayout";

const Contact = () => {
    return (
        <GuestLayout showFooter={true}>
            {/* Hero Section */}
            <section
                className="bg-pink flex items-center justify-center min-h-[600px] bg-cover"
                style={{ backgroundImage: "url('/image/bghero.png')" }}
            >
                <div className="text-center text-white max-w-5xl mx-auto px-2 py-8">
                    <h1 className="text-6xl font-bold mb-6 mt-10">
                        Ada Pertanyaan?
                    </h1>
                    <p className="text-lg leading-relaxed font-medium">
                        Jika Anda membutuhkan informasi lebih lanjut tentang
                        layanan kami atau mengalami kesulitan, jangan ragu untuk
                        menghubungi kami. Tim kami siap membantu Anda kapan
                        saja!
                    </p>
                </div>
            </section>

            {/* Info Bantuan Section */}
            <section className="py-8 mx-20 bg-white">
                <h2 className="text-2xl font-bold text-pink mb-4">
                    Kami Siap Membantu!
                </h2>
                <p className="text-lg text-pink font-medium mb-4">
                    Apabila Anda memiliki pertanyaan dan saran mengenai layanan
                    kami yang tidak dapat ditemukan di Pusat Bantuan, <br />
                    mohon menghubungi{" "}
                    <a href="#" className="font-bold underline">
                        mitraavesta@avesta.com
                    </a>{" "}
                    atau{" "}
                    <a
                        href="https://wa.me/6282331462202?text=Halo%2C%20tim%20Avesta%21%20Saya%20membutuhkan%20bantuan%20terkait%20layanan%20Avesta.%20Bisakah%20saya%20mendapatkan%20panduan%20atau%20informasi%20lebih%20lanjut%2C%20Terima%20kasih."
                        className="font-bold underline"
                    >
                        whatsapp
                    </a>{" "}
                    kami untuk segera dibantu.
                </p>
                <p className="text-lg text-pink font-medium max-w-6xl mb-2">
                    <span className="font-bold">PERHATIAN:</span> Karyawan dan
                    petugas Avesta tidak akan pernah meminta transfer dana
                    ataupun menanyakan PIN, kode OTP, nomor kartu ATM/kredit,
                    nama gadis ibu kandung, dan identitas lainnya. Semua
                    informasi tersebut sangat bersifat rahasia dan hanya
                    diketahui oleh Anda. Jika Anda menerima email atau telepon
                    mencurigakan yang mengatasnamakan Avesta, silakan adukan ke
                    Pusat Bantuan Mitra Usaha Avesta melalui{" "}
                    <a href="#" className="font-bold underline">
                        mitraavesta@avesta.com
                    </a>
                </p>
            </section>
        </GuestLayout>
    );
};

export default Contact;
