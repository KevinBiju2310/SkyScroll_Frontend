import { MapPin } from 'lucide-react';

const PopularDestinations = () => {
  const destinations = [
    { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPK7gzVvAp5IQtgW5OUuTUDyfVZSMU5RvxKQ&s', city: 'Paris', country: 'France', price: '$599' },
    { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPK7gzVvAp5IQtgW5OUuTUDyfVZSMU5RvxKQ&s', city: 'Tokyo', country: 'Japan', price: '$899' },
    { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPK7gzVvAp5IQtgW5OUuTUDyfVZSMU5RvxKQ&s', city: 'New York', country: 'USA', price: '$499' },
    { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPK7gzVvAp5IQtgW5OUuTUDyfVZSMU5RvxKQ&s', city: 'Sydney', country: 'Australia', price: '$1099' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((dest, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src={dest.image} alt={`${dest.city}, ${dest.country}`} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{dest.city}, {dest.country}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Flight
                  </span>
                  <span className="text-blue-600 font-bold">{dest.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;