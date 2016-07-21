using System.Collections.Generic;
using IBot.Core.Entities;

namespace IBot.Web.Dto
{
    public class PaymentData
    {
        public string AccountId { get; set; }
        public IEnumerable<Transaction> Transactions { get; set; }

        public PaymentData(string accountId, IEnumerable<Transaction> transactions)
        {
            AccountId = accountId;
            Transactions = transactions;
        }
    }
}