import Faq from "../components/HomePageComponents/Faq";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HomePageComponents/HeroSection";
import HowItWorks from "../components/HomePageComponents/HowItWorks";
import ScrollToTop from "../components/ScrollToTop";

const HomePage = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <HowItWorks />
      <Faq />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default HomePage;
