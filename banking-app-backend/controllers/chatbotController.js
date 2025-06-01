export const generateChatbotResponse = async (userMessage) => {
  const msg = userMessage.toLowerCase();

  // Greetings
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("good morning")) {
    return "Hello! Welcome to AMEN Bank. How can I help you today?";
  }

  // Account services
  if (msg.includes("open account") || msg.includes("account opening")) {
    return "To open an account, please visit your nearest AMEN Bank branch or go to our online portal: https://amenbank.com.tn.";
  }

  if (msg.includes("close account")) {
    return "To close your account, please visit an AMEN Bank branch with a valid ID. Our staff will assist you.";
  }

  if (msg.includes("account balance")) {
    return "For your security, I cannot access account details. Please check your balance through our mobile app or online banking.";
  }

  // Cards
  if (msg.includes("lost card") || msg.includes("block card") || msg.includes("stolen card")) {
    return "Please call our emergency card support at +216 71 123 456 immediately to block your card.";
  }

  if (msg.includes("get new card") || msg.includes("apply for card")) {
    return "You can request a new debit or credit card at your branch or through the AMEN Bank mobile app.";
  }

  // Transfers & payments
  if (msg.includes("transfer") || msg.includes("send money")) {
    return "You can make a transfer by logging into online banking and selecting 'Transfers'. Fees may apply depending on the destination.";
  }

  if (msg.includes("international transfer")) {
    return "Yes, international transfers are available. Please visit a branch for compliance checks and fees.";
  }

  if (msg.includes("loan") || msg.includes("credit")) {
    return "We offer various loan products such as personal loans, car loans, and home financing. Visit https://amenbank.com.tn or your local branch to learn more.";
  }

  // Customer service
  if (msg.includes("contact") || msg.includes("help") || msg.includes("support")) {
    return "You can reach AMEN Bank customer service at +216 71 123 456 or visit your local branch.";
  }

  // Working hours
  if (msg.includes("working hours") || msg.includes("open") || msg.includes("when are you open")) {
    return "Our branches are open from Monday to Friday, 8:30 AM to 4:30 PM.";
  }

  // ATM
  if (msg.includes("atm") || msg.includes("nearest atm") || msg.includes("cash machine")) {
    return "To find the nearest AMEN Bank ATM, please visit: https://amenbank.com.tn/atm-locator.";
  }

  // IBAN or Swift
  if (msg.includes("iban") || msg.includes("swift")) {
    return "You can find your IBAN and SWIFT code by logging into online banking or checking your account statement.";
  }

  // Mobile app
  if (msg.includes("app") || msg.includes("mobile banking")) {
    return "Our mobile app is available on web. Just search 'AMEN Bank' in the google to use.";
  }

  // Security
  if (msg.includes("fraud") || msg.includes("unauthorized transaction")) {
    return "Please report suspicious activity immediately by calling +216 71 123 456 or visiting a branch.";
  }

  // Default fallback
  return "I'm here to help with general banking questions. For anything specific, please call our support line at +216 71 123 456.";
};
