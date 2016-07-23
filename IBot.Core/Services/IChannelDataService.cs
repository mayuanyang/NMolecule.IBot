using System.Threading.Tasks;
using Microsoft.Bot.Connector;

namespace IBot.Core.Services
{
    public interface IChannelDataService<TChannelDataOut>
    {
        Task<TChannelDataOut> GenerateChannelSpecificData(Activity activity, dynamic data);
    }

    class SlackChannelDataService : IChannelDataService<SlackChannelDataContract>
    {
        public Task<SlackChannelDataContract> GenerateChannelSpecificData(Activity activity, dynamic data)
        {
            var result = new SlackChannelDataContract(activity, data);
            return Task.FromResult(result);
        }
    }
}
