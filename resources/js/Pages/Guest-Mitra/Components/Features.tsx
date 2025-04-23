interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export default function Features(){
  const features = [
    {
      title: 'Jangkauan Lebih Luas',
      description: 'Jangkau pelanggan di daerah Anda dengan lebih mudah.',
      icon: "/image/vector1.png",
    },
    {
      title: 'Pengelolaan yang Mudah',
      description: 'Atur produk, harga, dan pesanan Anda melalui sistem yang user-friendly.',
      icon: "/image/vector2.png",
    },
    {
      title: 'Pembayaran Praktis',
      description: 'Gunakan transfer manual untuk pembayaran langsung yang aman dan terpercaya.',
      icon: "/image/vector3.png",
    },
    {
      title: 'Dukungan Penuh',
      description: 'Tim kami siap membantu Anda kapan saja.',
      icon: "/image/vector4.png",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {features.map((item, index) => (
        <FeatureCard
          key={index}
          title={item.title}
          description={item.description}
          icon={item.icon}
        />
      ))}
    </div>
  );
};

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <div
      className="bg-pink p-6 rounded-3xl shadow-md flex items-center"
    >
      <div className="flex bg-white items-center justify-center min-w-24 h-full p-4 rounded-3xl mr-4">
        <img className="object-cover" src={icon} alt="Icon" />
      </div>
      <div className="text-left">
        <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
        <p className="text-white">{description}</p>
      </div>
    </div>
  );
};