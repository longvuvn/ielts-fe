import HeroSection from "../../components/home/HeroSection";
import CommunitySection from "../../components/home/CommunitySection";
import SkillsSection from "../../components/home/SkillsSection";

const HomePage = () => {
  return (
    <div className="bg-white">
      <HeroSection />
      <SkillsSection />
      <CommunitySection />
    </div>
  );
};

export default HomePage;
