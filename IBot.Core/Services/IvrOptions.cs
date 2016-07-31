namespace IBot.Core.Services
{
    public static class IvrOptions
    {
        internal const string WelcomeMessage = "Welcome to collection house Payment IVR system";

        internal const string MainMenuPrompt =
            "To make a payment press 1, to check your account balance press 2";

    
        internal const string PaymentPrompt =
            "To make credit card payment press 1, to make a direct debit payment press 2. Press the hash key to return to the main menu";
        

        internal const string UalPrompt = "Please key in your UAL";
        internal const string CreditCardNumberPrompt = "Please key in your credit card number follow by the hash key";
        internal const string CreditCardExpiryDatePrompt = "Please key in your expiry date follow by the hash key";
        internal const string CreditCardCheckDigitPrompt = "Please key in three digit security code follow by the hash key";
        internal const string DirectDebitDetailsPrompt = "Please key in BSB and account number";


        internal const string LeaveMessage = "Please leave a message";
        internal const string Ending = "Thank you for your payment, goodbye";

      
    }
}