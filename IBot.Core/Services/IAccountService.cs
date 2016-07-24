using System.Linq;
using IBot.Core.Entities;
using IBot.Core.Repositories;

namespace IBot.Core.Services
{
    public interface IAccountService
    {
        Account GetAccount(Luis luis);
    }

    class AccountService : IAccountService
    {
        private readonly IRepository<Account> _accRepository;
        private readonly IRepository<Transaction> _txRepository;

        public AccountService(IRepository<Account> accRepository, IRepository<Transaction> txRepository)
        {
            _accRepository = accRepository;
            _txRepository = txRepository;
        }

        public Account GetAccount(Luis luis)
        {
            var ual = luis.entities.FirstOrDefault(x => x.type.ToUpper() == "UAL");
            if (ual == null)
                return null;
            var acc = _accRepository.SingleOrDefault(x => x.AccountId == ual.entity);
            if (acc != null)
            {
                var transactions = _txRepository.Where(x => x.AccountId == ual.entity).ToList();
                var balance = transactions.Sum(x => (x.TransactionType == TransactionType.Charge.ToString()) ? -x.Amount : x.Amount);
                acc.CurrentBalance = balance;
                return acc;
            }
            return null;
        }
    }
}
