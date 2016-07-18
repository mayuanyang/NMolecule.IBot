using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using IBot.Core;
using IBot.Core.Entities;
using IBot.Core.Forms;
using IBot.Core.Repositories;
using Microsoft.Bot.Builder.FormFlow;
using Microsoft.Bot.Connector;
using Serilog;

namespace IBot.Web
{

    public class MessagesController : ApiController
    {
        private readonly ILuisProcessEngine _engine;
        private readonly IRepository<Account> _accRepository;
        private readonly IRepository<Transaction> _txRepository;
        private readonly ILogger _logger;

        public MessagesController(ILuisProcessEngine engine, IRepository<Account> accRepository, IRepository<Transaction> txRepository, ILogger logger)
        {
            _engine = engine;
            _accRepository = accRepository;
            _txRepository = txRepository;
            _logger = logger;
            if (_accRepository.List.Count == 0)
            {
                var cusId = Guid.NewGuid();
                for (int i = 0; i < 100; i++)
                {
                    var acc = new Account()
                    {
                        AccountId = "4601234567" + i,
                        CurrentBalance = 100 + i,
                        CustomerId = cusId
                    };
                    _accRepository.Add(acc);
                }
            }

        }

        static IFormDialog<PaymentForm> MakeAddPaymentFormDialog()
        {
            return FormDialog.FromForm(PaymentForm.MakeForm);
        }

        /// <summary>
        /// POST: api/Messages
        /// Receive a message from a user and reply to it
        /// </summary>
        public async Task Post([FromBody]Activity message)
        {
            try
            {

                var serviceUri = new Uri(message.ServiceUrl);
                var connector = new ConnectorClient(serviceUri);
                
                if (message.Type.ToUpper() == "MESSAGE")
                {
                    var msg = message.CreateReply("Message received");
                    await connector.Conversations.SendToConversationAsync(msg);

                    var luis = await _engine.ProcessMessage(message);

                    if (luis.intents[0].intent == "GetAccountInfo")
                    {
                        if (luis.entities.Length > 0)
                        {
                            
                            var account = _accRepository.SingleOrDefault(x => x.AccountId == luis.entities[0].entity);
                            msg.Attachments = new List<Attachment>();
                            msg.Attachments.Add(new Attachment("application/json", "", account));
                            await connector.Conversations.SendToConversationAsync(msg);
                           
                        }
                        else
                        {
                            await connector.Conversations.SendToConversationAsync(msg);
                        }
                        
                    }
                    if (luis.intents[0].intent == "GetPayments")
                    {
                        if (luis.entities.Length > 0)
                        {

                            //var stateClient = message.GetStateClient();
                            //var userData = await stateClient.BotState.GetUserDataAsync(message.ChannelId, message.From.Id);
                            //userData.SetProperty("Data", account);
                            //await stateClient.BotState.SetUserDataAsync(message.ChannelId, message.From.Id, userData);
                            var payments = _txRepository.Where(x => x.AccountId == luis.entities[0].entity).ToList();
                            msg =
                                message.CreateReply(
                                    $"The intent is {luis.intents[0].intent} and entity is {luis.entities[0].entity}");
                            msg.Attachments = new List<Attachment>();
                            msg.Attachments.Add(new Attachment("application/json", "", payments));

                            await connector.Conversations.SendToConversationAsync(msg);
                        }
                        else
                        {
                            msg = message.CreateReply("Transaction not found");
                            await connector.Conversations.SendToConversationAsync(msg);
                        }
                    }
                    if (luis.intents[0].intent == "AddPayment")
                    {
                        await connector.Conversations.SendToConversationAsync(message.CreateReply($"The intent is {luis.intents[0].intent} and entity is {luis.entities[0].entity}"));
                    }
                  
                }
                else
                {
                    await connector.Conversations.SendToConversationAsync(HandleSystemMessage(message));
                }
                
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "An error has occured");
                //throw;
                
            }
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