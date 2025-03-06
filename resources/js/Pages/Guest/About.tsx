import React from "react";
import GuestLayout from "../../Layouts/GuestLayout";

const About = () => {
    return (
        <GuestLayout showFooter={true}>
            <section
                className="bg-pink flex items-center justify-center min-h-[600px] bg-cover"
                style={{ backgroundImage: "url('/image/bghero.png')" }}
            >
                <div className="text-center text-white max-w-3xl mx-auto px-2 py-8">
                    <h1 className="text-6xl font-bold mb-6 mt-10">Avesta</h1>
                    <p className="text-lg leading-relaxed font-medium">
                        Avesta adalah sistem informasi pencarian unggas berbasis
                        marketplace yang dirancang untuk mempermudah pembelian
                        ayam potong di tingkat kecamatan. Sistem ini
                        memungkinkan pemilik warung untuk mempromosikan ayam
                        potong mereka, dan pembeli untuk mencari serta memesan
                        secara online.
                    </p>
                </div>
            </section>

            <section className="bg-[#FFE7EA] py-12">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold text-pink mb-6">
                        Tentang Avesta
                    </h2>
                    <p className="text-pink font-medium max-w-5xl mx-auto leading-relaxed">
                        Avesta tidak hanya sekadar platform marketplace unggas,
                        tetapi kami hadir untuk memberdayakan pemilik warung dan
                        peternak di tingkat kecamatan agar dapat bersaing di era
                        digital. Melalui Avesta, kami berkomitmen untuk
                        mendukung perekonomian lokal dengan menyediakan akses
                        yang mudah bagi konsumen untuk mendapatkan daging ayam
                        segar langsung dari peternak.
                    </p>
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold text-pink mb-6">
                        Visi Kami
                    </h2>
                    <p className="text-pink font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
                        Mewujudkan perekonomian digital yang memberdayakan
                        setiap pedagang ayam potong di seluruh Indonesia.
                    </p>
                    <h2 className="text-3xl font-bold text-pink mb-8">
                        Misi Kami
                    </h2>
                    <div className="flex flex-col md:flex-row justify-center items-stretch space-y-6 md:space-y-0 md:space-x-6">
                        {[
                            {
                                img: "/image/growth.png",
                                text: "Meningkatkan visibilitas dan penjualan pemilik warung melalui platform kami.",
                            },
                            {
                                img: "/image/clicked.png",
                                text: "Memberikan solusi pemesanan yang mudah dan aman untuk pembelian ayam potong.",
                            },
                            {
                                img: "/image/deal.png",
                                text: "Menghubungkan pedagang dan pembeli dengan cara yang lebih efisien dan modern.",
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-[#FFE7EA] p-6 rounded-lg shadow-md w-[258px] flex flex-col h-full"
                            >
                                <div className="flex justify-center mb-8">
                                    <img
                                        src={item.img}
                                        className="max-h-24"
                                        alt="Misi Avesta"
                                    />
                                </div>
                                <h3 className="text-lg font-medium text-pink mb-2 flex-grow">
                                    {item.text}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto max-w-5xl text-center">
                    <div className="bg-[#FFE7EA] p-6 rounded-xl">
                        <h2 className="text-2xl font-bold text-pink mb-6">
                            Mengapa Kami Peduli?
                        </h2>
                        <p className="text-pink max-w-3xl mx-auto leading-relaxed font-medium">
                            Kami menyadari bahwa banyak pedagang kecil kesulitan
                            bersaing dengan platform besar. Oleh karena itu,
                            kami menciptakan Avesta sebagai solusi untuk
                            memfasilitasi penjualan unggas secara online dengan
                            biaya yang terjangkau dan proses yang sederhana.
                        </p>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
};

export default About;
