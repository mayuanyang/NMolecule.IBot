using System;

namespace IBot.Core.Entities
{
    public class Account
    {
        public string AccountId { get; set; }
        public decimal CurrentBalance { get; set; }
        public Guid CustomerId { get; set; }
    }
}
