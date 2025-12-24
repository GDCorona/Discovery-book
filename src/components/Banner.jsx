import { useEffect, useState } from "react";

const banners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1600",
    title: "Mùa Giáng Sinh rộn ràng",
    subtitle: "Giảm giá SỐC lên đến 50% cho hàng ngàn đầu sách",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1600",
    title: "Quà tặng tháng 12",
    subtitle: "Khám phá bộ sưu tập sách Mùa Đông và Văn học kinh điển",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1600",
    title: "Đọc sách mỗi ngày",
    subtitle: "Mở rộng tri thức – Nuôi dưỡng tâm hồn",
  },
];

export default function Banner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-100 rounded-xl overflow-hidden shadow-lg">
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={b.image}
            alt={b.title}
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center">
            <div className="ml-12 text-white max-w-lg">
              <h2 className="text-4xl font-bold mb-3">{b.title}</h2>
              <p className="text-lg mb-5">{b.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
