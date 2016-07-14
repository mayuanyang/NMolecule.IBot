using System;
using IBot.Core.Forms;

namespace IBot.Core.Entities
{
    public class Transaction
    {
        public Guid TransactionId { get; set; }
        public decimal Amount { get; set; }
        public PaymentProcessor PaymentProcessor { get; set; }
        public TransactionType TransactionType { get; set; }
        public TransactionStatus TransactionStatus { get; set; }
        public string AccountId { get; set; }
    }
}