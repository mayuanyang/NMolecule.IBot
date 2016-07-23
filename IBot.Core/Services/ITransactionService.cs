using System.Collections.Generic;
using IBot.Core.Entities;

namespace IBot.Core.Services
{
    public interface ITransactionService
    {
        IEnumerable<Transaction> Search(Luis luis);
    }
}
