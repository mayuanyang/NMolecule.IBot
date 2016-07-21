using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using IBot.Core;
using IBot.Core.Entities;
using IBot.Core.Forms;
using IBot.Core.Repositories;
using IBot.Web.Dto;
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
                    for (int j = 0; j < 10; j++)
                    {
                        var tx = new Transaction
                        {
                            AccountId = acc.AccountId,
                            Amount = new Random(j).Next(200),
                            PaymentProcessor = (PaymentProcessor)new Random(j).Next(3),
                            TransactionId = Guid.NewGuid(),
                            TransactionStatus = (TransactionStatus)new Random(j).Next(2),
                            TransactionType = (TransactionType)new Random(j).Next(1)
                        };
                        _txRepository.Add(tx);
                    }
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
                    
                    var luis = await _engine.ProcessMessage(message);

                    if (luis.intents[0].intent == "GetAccountInfo")
                    {
                        if (luis.entities.Length > 0)
                        {
                            var msg = message.CreateReply("Here is your account information");
                            var account = _accRepository.SingleOrDefault(x => x.AccountId == luis.entities[0].entity);
                            msg.ChannelData = account;
                            msg.Attachments = new List<Attachment>();
                            msg.Attachments.Add(new Attachment("application/json", "", account));
                            await connector.Conversations.SendToConversationAsync(msg);
                           
                        }
                        else
                        {
                            await connector.Conversations.SendToConversationAsync(message.CreateReply("Sorry, we cannot find the account by the given account Id"));
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
                            var msg =
                                message.CreateReply(
                                    $"The intent is {luis.intents[0].intent} and entity is {luis.entities[0].entity}");
                            msg.ChannelData = new PaymentData(luis.entities[0].entity, payments);
                            
                            await connector.Conversations.SendToConversationAsync(msg);
                        }
                        else
                        {
                            var msg = message.CreateReply("I don't understand what you are after, please at least provide a Ual");
                            await connector.Conversations.SendToConversationAsync(msg);
                        }
                    }
                    if (luis.intents[0].intent == "AddPayment")
                    {
                        await connector.Conversations.SendToConversationAsync(message.CreateReply($"The intent is {luis.intents[0].intent} and entity is {luis.entities[0].entity}"));
                    }
                    if(luis.intents[0].intent == "SendRecReport")
                    {
                        await connector.Conversations.SendToConversationAsync(message.CreateReply($"I will send you the report shortly to your email"));
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