using System;
using Microsoft.Bot.Builder.FormFlow;

namespace IBot.Core.Forms
{
    public class PaymentForm
    {
        public static IForm<PaymentForm> MakeForm()
        {
            var form = new FormBuilder<PaymentForm>();
            return form
                .Message("You are about to add a payment")
                .AddRemainingFields()
                .Confirm("Are you sure?")
                .Build();

        }

        public decimal Amount { get; set; }
        public DateTimeOffset TransactionDate { get; set; }
        public DateTimeOffset PostedDate { get; set; }
        public PaymentProcessor PaymentProcessor { get; set; }
        [Prompt("Please give me a Ual")]
        public string AccountId { get; set; }
    }
}