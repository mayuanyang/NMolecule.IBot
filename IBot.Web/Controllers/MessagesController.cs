using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using IBot.Core;
using IBot.Core.Entities;
using IBot.Core.Forms;
using IBot.Core.Repositories;
using IBot.Core.Services;
using IBot.Web.Dto;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.Dialogs.Internals;
using Microsoft.Bot.Builder.FormFlow;
using Microsoft.Bot.Connector;
using Serilog;

namespace IBot.Web
{
    
    public class MessagesController : ApiController
    {
        private readonly ILuisProcessEngine _engine;
        private readonly ILogger _logger;
        private readonly IChannelDataService<SlackChannelDataContract> _slaceChannelDataService;
        private readonly ITransactionService _txService;
        private readonly IAccountService _accountService;
        private static IRepository<Transaction> _txRepository;
        
        public MessagesController(ILuisProcessEngine engine, ILogger logger, IChannelDataService<SlackChannelDataContract> slaceChannelDataService, ITransactionService txService, IAccountService accountService, IRepository<Transaction> txRepository)
        {
            _engine = engine;
            _logger = logger;
            _slaceChannelDataService = slaceChannelDataService;
            _txService = txService;
            _accountService = accountService;
            _txRepository = txRepository;
        }

 
        static IDialog<PaymentForm> MakeAddPaymentFormDialog()
        {
            var dialog = Chain.From(() => FormDialog.FromForm(PaymentForm.MakeForm));
            PaymentForm.TransactionRepository = _txRepository;
            return dialog;
        }

        /// <summary>
        /// POST: api/Messages
        /// Receive a message from a user and reply to it
        /// </summary>
        public async Task<HttpResponseMessage> Post([FromBody]Activity activity)
        {
            try
            {
                var serviceUri = new Uri(activity.ServiceUrl);
                var connector = new ConnectorClient(serviceUri);
                //await connector.Conversations.SendToConversationAsync(activity.CreateReply($"The channel Id is {activity.ChannelId}"));
                
                if (activity.Type.ToUpper() == "MESSAGE")
                {
                    var intend = "";
                    var stateClient = activity.GetStateClient();
                    var userData = await stateClient.BotState.GetUserDataAsync(activity.ChannelId, activity.From.Id);
                    Luis luis = null;
                    if (userData.GetProperty<bool>("IsInDialog"))
                    {
                        intend = "AddPayment";
                    }
                    else
                    {
                        luis = await _engine.ProcessMessage(activity);
                        intend = luis.intents[0].intent;
                    }
                        
                    if (intend == "GetAccountInfo")
                    {
                        if (luis.entities.Length > 0)
                        {
                            var account = _accountService.GetAccount(luis);
                            if (account != null)
                            {
                                var reply = activity.CreateReply($"Here is your account information");
                                if (activity.ChannelId == "slack")
                                {
                                    reply.ChannelData =
                                        await _slaceChannelDataService.GenerateChannelSpecificData(reply, account);
                                }
                                else
                                {
                                    reply.ChannelData = account;
                                }
                                await connector.Conversations.SendToConversationAsync(reply);
                            }
                            else
                            {
                                await connector.Conversations.SendToConversationAsync(activity.CreateReply($"Sorry, we cannot find the account by the given account Id"));
                            }
                        }
                        else
                        {
                            await connector.Conversations.SendToConversationAsync(activity.CreateReply($"Sorry, we cannot find the account by the given account Id"));
                        }
                        
                    }
                    if (intend == "GetPayments")
                    {
                        if (luis.entities.Length > 0)
                        {
                            var ual = luis.entities.FirstOrDefault(x => x.type.ToUpper() == "UAL");
                            if (ual == null)
                            {
                                await NoUalFound(activity, connector);
                                return Request.CreateResponse(HttpStatusCode.NoContent);
                            }
                            var payments = _txService.Search(luis);
                            var reply = activity.CreateReply($"Here is the transactions information");

                            if (activity.ChannelId == "slack" || activity.ChannelId == "emulator")
                            {
                                reply.ChannelData = await _slaceChannelDataService.GenerateChannelSpecificData(reply, new PaymentData(luis.entities[0].entity, payments));
                            }
                            else
                            {
                                reply.ChannelData = new PaymentData(ual.entity, payments);
                            }
                            
                            await connector.Conversations.SendToConversationAsync(reply);
                        }
                        else
                        {
                            await NoUalFound(activity, connector);
                        }
                    }
                    if (intend == "AddPayment")
                    {
                        var isQuit = activity.Text.ToUpper() == "QUIT";
                        if (isQuit)
                        {
                            await stateClient.BotState.DeleteStateForUserAsync(activity.ChannelId, activity.From.Id);
                            await connector.Conversations.SendToConversationAsync(activity.CreateReply($"See you"));
                            return Request.CreateResponse(HttpStatusCode.OK);
                        }
                        userData.SetProperty("IsInDialog", true);
                        await stateClient.BotState.SetUserDataAsync(activity.ChannelId, activity.From.Id, userData);
                        await Conversation.SendAsync(activity, MakeAddPaymentFormDialog);
                    }
                    if(intend == "SendRecReport")
                    {
                        await connector.Conversations.SendToConversationAsync(activity.CreateReply($"I will send you the report shortly to your email"));
                    }
                  
                }
                else
                {
                    await connector.Conversations.SendToConversationAsync(HandleSystemMessage(activity));
                }
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "An error has occured");
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);

            }
        }

        private static async Task NoUalFound(Activity activity, ConnectorClient connector)
        {
            var reply = activity.CreateReply($"I don't understand what you are after, please at least provide a Ual");
            await connector.Conversations.SendToConversationAsync(reply);
        }

        private Activity HandleSystemMessage(Activity message)
        {
            if (message.Type == "Ping")
            {
                Activity reply = message.CreateReply();
                reply.Type = "Ping";
                return reply;
            }
            else if (message.Type == "DeleteUserData")
            {
                // Implement user deletion here
                // If we handle user deletion, return a real message
            }
            else if (message.Type == "BotAddedToConversation")
            {
            }
            else if (message.Type == "BotRemovedFromConversation")
            {
            }
            else if (message.Type == "UserAddedToConversation")
            {
            }
            else if (message.Type == "UserRemovedFromConversation")
            {
            }
            else if (message.Type == "EndOfConversation")
            {
            }

            return null;
        }
    }
}