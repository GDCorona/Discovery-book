
import Banner from "../components/Banner";
import BookCarousel from "../components/BookCarousel";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <Banner />

      <BookCarousel title="🔥 Best Sellers" query="best seller books" />
      <BookCarousel title="📈 Trending Now" query="trending books" />
      <BookCarousel title="🎄 Christmas Specials" query="christmas books" />
    </div>
  );
}
