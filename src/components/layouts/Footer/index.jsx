import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 pb-16 border-b border-gray-800">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
              <span className="font-bold text-xl">IELTS Master</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your comprehensive platform for IELTS preparation. Achieve your
              target score with our expert guidance and practice materials.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
                <button
                  key={idx}
                  className="text-gray-400 hover:text-blue-500 transition"
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Study Materials */}
          <div>
            <h4 className="font-bold text-lg mb-6">Study Materials</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              {[
                "Listening Practice",
                "Reading Exercises",
                "Writing Tasks",
                "Speaking Practice",
                "Mock Tests",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-lg mb-6">Resources</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              {[
                "Study Guides",
                "Video Tutorials",
                "Grammar Reference",
                "Vocabulary Builder",
                "Test Strategies",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for IELTS tips and updates
            </p>
            <div className="flex mb-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none"
              />
              <button className="px-6 py-2 rounded-r-lg bg-blue-600 hover:bg-blue-700 transition font-semibold">
                Subscribe
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-400" />
                <span className="text-sm text-gray-400">
                  support@ieltmaster.com
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gray-400" />
                <span className="text-sm text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-gray-400" />
                <span className="text-sm text-gray-400">
                  Available Worldwide
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© 2025 IELTS Master. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
