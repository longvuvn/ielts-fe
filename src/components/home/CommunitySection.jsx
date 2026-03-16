import Button from "../button/button.home";
import { MessageCircle, Calendar } from "lucide-react";

const CommunitySection = () => {
  return (
    <section className="py-20 bg-blue-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Join Our Study Community
        </h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Connect with fellow IELTS candidates, share study tips, and get expert
          advice from our community of instructors and successful test-takers.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" icon={MessageCircle}>
            Join Community
          </Button>
          <Button variant="secondary" size="lg" icon={Calendar}>
            Schedule Consultation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
