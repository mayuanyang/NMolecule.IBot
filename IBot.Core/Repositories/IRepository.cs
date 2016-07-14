using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace IBot.Core.Repositories
{
    public interface IRepository<T> where T : class
    {
        IList<T> List { get; }
        void Add(T t);
        T SingleOrDefault(Func<T, bool> filter);
        Task<T> SingleOrDefaultAsync(Expression<Func<T, bool>> filter);
        IEnumerable<T> Where(Func<T, bool> filter);
    }
}
