using System;
using IBot.Core.Entities;
using IBot.Core.Repositories;
using Microsoft.Bot.Builder.FormFlow;

namespace IBot.Core.Forms
{
    
    [Serializable]
    public class PaymentForm
    {
        public static IRepository<Transaction> TransactionRepository;
        public static IForm<PaymentForm> MakeForm()
        {
            
            OnCompletionAsyncDelegate<PaymentForm> addPayment = async (context, state) =>
            {
                context.UserData.RemoveValue("IsInDialog");
                var msg = context.MakeMessage();
                msg.Text = "Payment is now posted";
                TransactionRepository.Add(new Transaction
                {
                    Amount = (decimal)state.Amount,
                    AccountId = state.AccountId,
                    PaymentProcessor = state.PaymentProcessor.ToString(),
                    TransactionId = Guid.NewGuid(),
                    TransactionStatus = TransactionStatus.BankedOff.ToString(),
                    TransactionType = TransactionType.Receipt.ToString(),
                    TransactionDate = state.TransactionDate
                });
                await context.PostAsync(msg);
            };

            var builder = new FormBuilder<PaymentForm>();
            return builder
                .Message("You are about to add a payment")
                .AddRemainingFields()
                .Confirm("Are you sure want to make this payment?")
                .OnCompletion(addPayment)
                .Build();

        }

        [Prompt("Please enter the payment amount")]
        public float Amount { get; set; }
        public DateTime TransactionDate { get; set; }
        public PaymentProcessor PaymentProcessor { get; set; }
        [Prompt("Please give me a Ual")]
        public string AccountId { get; set; }
    }
}