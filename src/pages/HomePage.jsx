import Faq from "../components/HomePageComponents/FAQ";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HomePageComponents/HeroSection";
import HowItWorks from "../components/HomePageComponents/HowItWorks";
import PopularDestinations from "../components/HomePageComponents/PopularDestinations";
import ScrollToTop from "../components/ScrollToTop";

const HomePage = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <HowItWorks />
      <PopularDestinations />
      <Faq />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default HomePage;
