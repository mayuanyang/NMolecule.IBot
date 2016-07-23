using System;
using IBot.Core.Forms;

namespace IBot.Core.Entities
{
    public class Transaction
    {
        public Guid TransactionId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentProcessor { get; set; }
        public string TransactionType { get; set; }
        public string TransactionStatus { get; set; }
        public string AccountId { get; set; }
    }
}