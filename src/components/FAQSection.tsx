import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "Is the AI chat widget HIPAA compliant?",
      answer: "Yes, our AI chat widget is fully HIPAA compliant. We ensure all patient communications are encrypted and securely stored, meeting all healthcare privacy requirements."
    },
    {
      question: "How long does it take to set up the chat widget?",
      answer: "Setup is incredibly fast - most dental practices have their AI assistant running in under 10 minutes. Simply copy and paste our embed code into your website."
    },
    {
      question: "Can the AI handle complex dental questions?",
      answer: "Our AI is specifically trained on dental knowledge and can handle a wide range of patient inquiries. For complex medical questions, it seamlessly transfers patients to your staff."
    },
    {
      question: "Can patients book appointments through the chat?",
      answer: "Yes! The AI can help patients schedule appointments, check availability, and even handle rescheduling requests, integrating with your existing practice management system."
    },
    {
      question: "What if the AI doesn't know how to answer a question?",
      answer: "When the AI encounters questions beyond its scope, it gracefully hands off to your team with full conversation context, ensuring patients always receive proper care."
    },
    {
      question: "How much does it cost?",
      answer: "Our AI chat widget starts at just $97/month with a simple setup process. No hidden fees, no long-term contracts - just better patient communication for your practice."
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Get answers to common questions about our dental AI chat widget
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;