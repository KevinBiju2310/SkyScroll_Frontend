import { useState } from "react";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I book a flight?",
      answer:
        "You can book a flight by using our search feature, selecting your preferred flight, and following the booking process. Make sure to have your payment information ready.",
    },
    {
      question: "Can I cancel my booking?",
      answer:
        "Yes, you can cancel your booking. Please refer to our cancellation policy for more details on fees and timeframes. Cancellations made within 24 hours of booking may be eligible for a full refund.",
    },
    {
      question: `What's included in the ticket price?`,
      answer:
        "The ticket price typically includes the base fare, taxes, and fees. Additional services like baggage, seat selection, or in-flight meals may have extra charges. Always check the fare details before booking.",
    },
    {
      question: "How can I check in for my flight?",
      answer:
        "You can check in for your flight online through our website or mobile app, usually starting 24 hours before departure. Alternatively, you can check in at the airport counter or self-service kiosk.",
    },
  ];

  return (
    <section className="py-20 bg-blue-50"> {/* Changed background color */}
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-black-700"> {/* Heading color */}
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4 border-b border-blue-200"> {/* Border color */}
              <button
                className="flex justify-between items-center w-full py-4 text-left text-blue-700 focus:outline-none hover:text-blue-500 transition duration-300"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-black">{faq.question}</span>
                <span className="text-2xl">{openIndex === index ? '-' : '+'}</span> {/* Using + and - */}
              </button>
              {openIndex === index && (
                <p className="pb-4 text-gray-600"> {/* Answer text color */}
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
