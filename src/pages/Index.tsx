
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome to IRMAI</h1>
          
          {user ? (
            <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Hello, {user.email}</h2>
              <p className="text-gray-600 mb-4">
                You are now signed in to your IRMAI account. You can start using all the features of the application.
              </p>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Your Intelligent Copilot</h2>
              <p className="text-gray-600 mb-4">
                Please sign in to access all features of IRMAI.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
