
import { Badge } from "@/components/ui/badge";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 kenya-gradient rounded-full mr-3"></div>
              <h1 className="text-xl font-bold kenya-text-gradient">
                Finance Bill 2025 AI Advisor
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-kenya-green text-kenya-green">
              Constitutional Rights Protected
            </Badge>
            <Badge variant="outline" className="border-kenya-red text-kenya-red">
              Chapter Six Integrity
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
