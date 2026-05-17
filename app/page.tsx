import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FloatDemo from "@/components/home/FloatDemo";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyItFloats from "@/components/home/WhyItFloats";
import Reviews from "@/components/home/Reviews";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <section id="float-demo">
        <FloatDemo />
      </section>
      <FeaturedProducts />
      <section id="why-it-floats">
        <WhyItFloats />
      </section>
      <section id="reviews">
        <Reviews />
      </section>
      <Footer />
    </main>
  );
}
