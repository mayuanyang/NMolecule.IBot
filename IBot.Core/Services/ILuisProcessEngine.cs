using System.Threading.Tasks;
using Microsoft.Bot.Connector;

namespace IBot.Core
{
    public interface ILuisProcessEngine
    {
        Task<Luis> ProcessMessage(Activity message);
    }
}