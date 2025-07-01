import { DEMO_CLINIC_DATA } from '@/data/demoClinicData';

const DISCLAIMER = "\n\nPlease remember that this is for informational purposes only and not a substitute for professional dental advice. For specific concerns, consult with a qualified dentist.";

export const getTemplatedResponse = (userMessage: string): string | null => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Office hours - improved mobile formatting
  if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('closed')) {
    return `Our office hours are:

📅 Monday: ${DEMO_CLINIC_DATA.officeHours.monday}
📅 Tuesday: ${DEMO_CLINIC_DATA.officeHours.tuesday}
📅 Wednesday: ${DEMO_CLINIC_DATA.officeHours.wednesday}
📅 Thursday: ${DEMO_CLINIC_DATA.officeHours.thursday}
📅 Friday: ${DEMO_CLINIC_DATA.officeHours.friday}
📅 Saturday: ${DEMO_CLINIC_DATA.officeHours.saturday}
📅 Sunday: ${DEMO_CLINIC_DATA.officeHours.sunday}

📞 Call us at ${DEMO_CLINIC_DATA.phone} to schedule your appointment!${DISCLAIMER}`;
  }
  
  // Location/Address - improved formatting
  if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where') || lowerMessage.includes('directions')) {
    return `📍 **Our Location:**

${DEMO_CLINIC_DATA.address}

We're conveniently located in downtown with easy parking available.

🌐 Find us online: ${DEMO_CLINIC_DATA.website}
📞 Call for directions: ${DEMO_CLINIC_DATA.phone}${DISCLAIMER}`;
  }
  
  // Services - improved mobile formatting
  if (lowerMessage.includes('service') || lowerMessage.includes('treatment') || lowerMessage.includes('what do you do') || lowerMessage.includes('procedures')) {
    return `At ${DEMO_CLINIC_DATA.name}, we offer:

🦷 **Our Services:**
${DEMO_CLINIC_DATA.services.map(service => `• ${service}`).join('\n')}

We provide personalized care for patients of all ages.

📞 Call ${DEMO_CLINIC_DATA.phone} to learn more about any specific treatment or schedule a consultation.${DISCLAIMER}`;
  }
  
  // Insurance - improved formatting
  if (lowerMessage.includes('insurance') || lowerMessage.includes('coverage') || lowerMessage.includes('accepted')) {
    return `💳 **Insurance We Accept:**

${DEMO_CLINIC_DATA.insurance.map(plan => `• ${plan}`).join('\n')}
• Most PPO plans

💰 **Payment Options:**
• Flexible payment plans
• Financing available
• Insurance benefit maximization

📞 Call ${DEMO_CLINIC_DATA.phone} to verify your coverage.${DISCLAIMER}`;
  }
  
  // Contact/Phone - improved formatting
  if (lowerMessage.includes('phone') || lowerMessage.includes('call') || lowerMessage.includes('contact') || lowerMessage.includes('number')) {
    return `📞 **Contact ${DEMO_CLINIC_DATA.name}:**

**Phone:** ${DEMO_CLINIC_DATA.phone}
**Email:** ${DEMO_CLINIC_DATA.email}
**Website:** ${DEMO_CLINIC_DATA.website}
**Address:** ${DEMO_CLINIC_DATA.address}

We're here to help with any questions or to schedule your appointment!${DISCLAIMER}`;
  }
  
  // Emergency - improved formatting
  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('pain') || lowerMessage.includes('after hours')) {
    return `🚨 **Dental Emergency Care:**

**During Office Hours:**
Call immediately: ${DEMO_CLINIC_DATA.phone}

**After Hours:**
${DEMO_CLINIC_DATA.emergencyInstructions}

**We Treat:**
• Severe tooth pain
• Knocked-out teeth
• Broken or chipped teeth
• Lost fillings or crowns
• Dental abscesses

⚠️ Don't wait - dental emergencies require prompt attention!${DISCLAIMER}`;
  }
  
  // Appointment scheduling - improved formatting
  if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule') || lowerMessage.includes('book') || lowerMessage.includes('visit')) {
    return `📅 **Schedule Your Appointment:**

**How to Book:**
📞 Call: ${DEMO_CLINIC_DATA.phone}
🌐 Online: ${DEMO_CLINIC_DATA.website}
📧 Email: ${DEMO_CLINIC_DATA.email}

**Availability:**
• New patients: 1-2 weeks
• Urgent care: Often same-day
• Early morning & Saturday appointments available

What type of appointment would you like to schedule?${DISCLAIMER}`;
  }
  
  return null;
};
