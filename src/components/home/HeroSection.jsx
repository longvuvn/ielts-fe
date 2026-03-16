import Button from "../button/button.home";
import { Play } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Master IELTS with <span className="text-blue-500">Confidence</span>
          </h1>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Comprehensive study materials, practice tests, and expert guidance
            to help you achieve your target IELTS score. Join thousands of
            successful test-takers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="primary" size="lg">
              Start Free Trial
            </Button>
            <Button variant="secondary" size="lg" icon={Play}>
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row gap-8 mt-10 pt-10 border-t border-gray-200">
            <div>
              <p className="text-2xl font-bold text-yellow-500">4.9/5</p>
              <p className="text-sm text-gray-600">rating</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">50k+</p>
              <p className="text-sm text-gray-600">students</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">95%</p>
              <p className="text-sm text-gray-600">success rate</p>
            </div>
          </div>
        </div>

        {/* Right - Score Calculator */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-8 text-center">
            IELTS Score Calculator
          </h3>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <p className="text-4xl font-bold text-blue-600">8.5</p>
              <p className="text-sm text-gray-600 mt-2">Listening</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <p className="text-4xl font-bold text-green-600">7.5</p>
              <p className="text-sm text-gray-600 mt-2">Reading</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <p className="text-4xl font-bold text-purple-600">7.0</p>
              <p className="text-sm text-gray-600 mt-2">Writing</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-6 text-center">
              <p className="text-4xl font-bold text-orange-600">8.0</p>
              <p className="text-sm text-gray-600 mt-2">Speaking</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center border-2 border-dashed border-blue-200">
            <p className="text-5xl font-bold text-gray-900">7.75</p>
            <p className="text-sm text-gray-600 mt-2">Overall Band Score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
