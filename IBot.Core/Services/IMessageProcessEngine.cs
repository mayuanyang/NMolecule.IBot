using System.Threading.Tasks;
using Microsoft.Bot.Connector;

namespace IBot.Core
{
    public interface IMessageProcessEngine
    {
        Task<Luis> ProcessMessage(Activity message);
    }
}