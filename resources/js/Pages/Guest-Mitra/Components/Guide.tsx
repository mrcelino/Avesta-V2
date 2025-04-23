const steps = [
  {
    step: 1,
    label: 'Daftar',
    image: "/image/guidemitra1.png",
    altText: 'Person with magnifying glass searching on a computer screen',
  },
  {
    step: 2,
    label: 'Unggah Produk',
    image: "/image/guidemitra2.png",
    altText: 'Person selecting items on a computer screen',
  },
  {
    step: 3,
    label: 'Mulai Jualan',
    image: "/image/guidemitra3.png",
    altText: 'Person holding a credit card with check marks',
  },
];

const StepCard = ({ step, label, image, altText }: { step: string | number; label: string; image: string; altText: string }) => {
  return (
      <div
      className="bg-pink text-white rounded-3xl p-6 flex flex-col items-center h-[415px]"
      >
      <img
          alt={altText}
          src={image}
          className="p-4 mt-16 w-full h-auto object-contain"
          width="150"
          height="150"
      />
      <div className="mt-auto flex items-center justify-center bg-white text-pink rounded-full px-4 py-2 font-bold w-52">
          <div className="flex items-center justify-center bg-pink text-white rounded-full w-8 h-8 mr-2">
          <span className="font-bold">{step}</span>
          </div>
          {label}
      </div>
      </div>
  );
  };

export default function StepGuide(){
return (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {steps.map((item, index) => (
      <StepCard
        key={index}
        step={item.step}
        label={item.label}
        image={item.image}
        altText={item.altText}
      />
    ))}
  </div>
);
};