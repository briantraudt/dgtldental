
import { DEMO_CLINIC_DATA } from '@/data/demoClinicData';

const DISCLAIMER = "\n\nPlease remember that this is for informational purposes only and not a substitute for professional dental advice. For specific concerns, consult with a qualified dentist.";

export const getTemplatedResponse = (userMessage: string): string | null => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Office hours
  if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('closed')) {
    return `Our office hours are:
    
Monday - Thursday: ${DEMO_CLINIC_DATA.officeHours.monday}
Friday: ${DEMO_CLINIC_DATA.officeHours.friday}
Saturday: ${DEMO_CLINIC_DATA.officeHours.saturday}
Sunday: ${DEMO_CLINIC_DATA.officeHours.sunday}

You can schedule an appointment by calling us at ${DEMO_CLINIC_DATA.phone} or through our website at ${DEMO_CLINIC_DATA.website}.${DISCLAIMER}`;
  }
  
  // Location/Address
  if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where') || lowerMessage.includes('directions')) {
    return `We're located at ${DEMO_CLINIC_DATA.address}. 

We're conveniently located in downtown with easy parking available. You can find detailed directions on our website at ${DEMO_CLINIC_DATA.website} or call us at ${DEMO_CLINIC_DATA.phone} if you need help finding us.${DISCLAIMER}`;
  }
  
  // Services
  if (lowerMessage.includes('service') || lowerMessage.includes('treatment') || lowerMessage.includes('what do you do') || lowerMessage.includes('procedures')) {
    return `At ${DEMO_CLINIC_DATA.name}, we offer a comprehensive range of dental services including:

• ${DEMO_CLINIC_DATA.services.join('\n• ')}

We provide personalized care for patients of all ages. Would you like to know more about any specific treatment or schedule a consultation? Call us at ${DEMO_CLINIC_DATA.phone}.${DISCLAIMER}`;
  }
  
  // Insurance
  if (lowerMessage.includes('insurance') || lowerMessage.includes('coverage') || lowerMessage.includes('accepted')) {
    return `We accept most major dental insurance plans, including:

• ${DEMO_CLINIC_DATA.insurance.join('\n• ')}
• Most PPO plans

We also offer flexible payment options and financing plans. Our team will help verify your benefits and maximize your insurance coverage. Please bring your insurance card to your appointment or call us at ${DEMO_CLINIC_DATA.phone} to verify coverage.${DISCLAIMER}`;
  }
  
  // Contact/Phone
  if (lowerMessage.includes('phone') || lowerMessage.includes('call') || lowerMessage.includes('contact') || lowerMessage.includes('number')) {
    return `You can reach ${DEMO_CLINIC_DATA.name} at:

📞 Phone: ${DEMO_CLINIC_DATA.phone}
📧 Email: ${DEMO_CLINIC_DATA.email}
🌐 Website: ${DEMO_CLINIC_DATA.website}
📍 Address: ${DEMO_CLINIC_DATA.address}

We're here to help with any questions or to schedule your appointment!${DISCLAIMER}`;
  }
  
  // Emergency
  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('pain') || lowerMessage.includes('after hours')) {
    return `For dental emergencies:

During office hours: Call us immediately at ${DEMO_CLINIC_DATA.phone}
After hours: ${DEMO_CLINIC_DATA.emergencyInstructions}

Common dental emergencies we treat:
• Severe tooth pain
• Knocked-out teeth
• Broken or chipped teeth
• Lost fillings or crowns
• Dental abscesses

Don't wait - dental emergencies require prompt attention!${DISCLAIMER}`;
  }
  
  // Appointment scheduling
  if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule') || lowerMessage.includes('book') || lowerMessage.includes('visit')) {
    return `I'd be happy to help you schedule an appointment at ${DEMO_CLINIC_DATA.name}!

You can schedule by:
📞 Calling us at ${DEMO_CLINIC_DATA.phone}
🌐 Online booking at ${DEMO_CLINIC_DATA.website}
📧 Emailing us at ${DEMO_CLINIC_DATA.email}

Our current availability:
• New patient appointments typically available within 1-2 weeks
• Urgent care appointments often same-day
• We offer early morning and Saturday appointments

What type of appointment are you looking for?${DISCLAIMER}`;
  }
  
  return null;
};
