using System;
using IBot.Core.Entities;
using IBot.Core.Forms;
using IBot.Core.Repositories;

namespace IBot.Core.Services
{
    class SampleDataService : ISampleDataService
    {
        private readonly IRepository<Account> _accRepository;
        private readonly IRepository<Transaction> _txRepository;

        public SampleDataService(IRepository<Account> accRepository, IRepository<Transaction> txRepository )
        {
            _accRepository = accRepository;
            _txRepository = txRepository;
        }

        public void Setup()
        {

            if (_accRepository.List.Count == 0)
            {
                var cusId = Guid.NewGuid();
                for (int i = 0; i < 100; i++)
                {
                    var acc = new Account()
                    {
                        AccountId = "4601234567" + i,
                        CurrentBalance = 100 + i,
                        CustomerId = cusId
                    };
                    _accRepository.Add(acc);
                    for (int j = 0; j < 10; j++)
                    {
                        var tx = new Transaction
                        {
                            AccountId = acc.AccountId,
                            Amount = new Random(j).Next(200),
                            TransactionType = (j % 2 == 0) ? TransactionType.Receipt.ToString() : TransactionType.Charge.ToString(),
                            PaymentProcessor = ((PaymentProcessor)new Random(j).Next(3)).ToString(),
                            TransactionId = Guid.NewGuid(),
                            TransactionStatus = ((TransactionStatus)new Random(j).Next(2)).ToString(),
                            
                        };
                        tx.PaymentProcessor = tx.TransactionType == "Charge" ? "" : tx.PaymentProcessor;
                        _txRepository.Add(tx);
                    }
                }
            }
        }
    }
}