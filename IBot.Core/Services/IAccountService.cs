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

        public AccountService(IRepository<Account> accRepository)
        {
            _accRepository = accRepository;
        }

        public Account GetAccount(Luis luis)
        {
            var ual = luis.entities.FirstOrDefault(x => x.type.ToUpper() == "UAL");
            if (ual == null)
                return null;
            return _accRepository.SingleOrDefault(x => x.AccountId == ual.entity);
        }
    }
}
