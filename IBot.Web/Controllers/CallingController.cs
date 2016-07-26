using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using IBot.Core.Services;
using Microsoft.Bot.Builder.Calling;
using Microsoft.Bot.Connector;
using Serilog;

namespace IBot.Web.Controllers
{
    
    [BotAuthentication]
    [RoutePrefix("api/calling")]
    public class CallingController : ApiController
    {
        private readonly ILogger _logger;

        public CallingController(ILogger logger)
            : base()
        {
            _logger = logger;
            CallingConversation.RegisterCallingBot(c => new SimpleIVRBot(c, _logger));
            _logger.Information(nameof(CallingController));
        }

        [Route("callback")]
        public async Task<HttpResponseMessage> ProcessCallingEventAsync()
        {
            _logger.Information(nameof(ProcessCallingEventAsync));
            return await CallingConversation.SendAsync(Request, CallRequestType.CallingEvent);
        }

        [Route("call")]
        public async Task<HttpResponseMessage> ProcessIncomingCallAsync()
        {
            _logger.Information(nameof(ProcessIncomingCallAsync));
            try
            {
                return await CallingConversation.SendAsync(Request, CallRequestType.IncomingCall);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "An error has occured");
            }
            return null;
        }
    }
}
