using System;

namespace IBot.Core.Entities
{
    public class Account
    {
        public decimal CurrentBalance { get; set; }
        public string AccountId { get; set; }
        public Guid CustomerId { get; set; }
    }
}
