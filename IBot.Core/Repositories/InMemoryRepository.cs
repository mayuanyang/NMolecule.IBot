using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace IBot.Core.Repositories
{
    public class InMemoryRepository<T> : IRepository<T> where T : class 
    {
        private readonly IList<T> _list = new List<T>();

        public IList<T> List
        {
            get { return _list; }
        }

        public void Add(T t)
        {
            _list.Add(t);
        }

        public T SingleOrDefault(Func<T, bool> filter)
        {
            return _list.SingleOrDefault(filter);
        }

        public async Task<T> SingleOrDefaultAsync(Expression<Func<T, bool>> filter)
        {
            var item = SingleOrDefault(filter.Compile());
            return await Task.FromResult(item);
        }

        public IEnumerable<T> Where(Func<T, bool> filter)
        {
            return _list.Where(filter);
        }
    }
}