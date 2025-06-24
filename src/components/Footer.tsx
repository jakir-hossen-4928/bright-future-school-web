
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">SchoolHub</h3>
            <p className="text-gray-300">
              Comprehensive school management system for modern education.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="/students" className="hover:text-white transition-colors">Students</a></li>
              <li><a href="/teachers" className="hover:text-white transition-colors">Teachers</a></li>
              <li><a href="/classes" className="hover:text-white transition-colors">Classes</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300">
              Email: info@schoolhub.com<br />
              Phone: (555) 123-4567
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-300">
          <p>&copy; 2024 SchoolHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
