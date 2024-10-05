import { Search, Plane, CreditCard } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    { icon: <Search className="w-12 h-12 text-blue-500" />, title: 'Search', description: 'Enter your travel details and find the best flights.' },
    { icon: <Plane className="w-12 h-12 text-blue-500" />, title: 'Select', description: 'Choose your preferred flight from the available options.' },
    { icon: <CreditCard className="w-12 h-12 text-blue-500" />, title: 'Book', description: 'Securely book your flight and get ready for your journey.' },
  ];

  return (
    <section className="py-20 bg-blue-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-white rounded-full p-6 inline-block mb-4 shadow-lg">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Get Started Button */}
        <div className="mt-12 text-center">
          <button className="bg-blue-500 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
