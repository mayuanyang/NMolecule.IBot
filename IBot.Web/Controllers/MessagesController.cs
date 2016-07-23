﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using IBot.Core;
using IBot.Core.Entities;
using IBot.Core.Forms;
using IBot.Core.Repositories;
using IBot.Core.Services;
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
        private readonly IChannelDataService<SlackChannelDataContract> _slaceChannelDataService;

        public MessagesController(ILuisProcessEngine engine, IRepository<Account> accRepository, IRepository<Transaction> txRepository, ILogger logger, IChannelDataService<SlackChannelDataContract> slaceChannelDataService )
        {
            _engine = engine;
            _accRepository = accRepository;
            _txRepository = txRepository;
            _logger = logger;
            _slaceChannelDataService = slaceChannelDataService;
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
        public async Task Post([FromBody]Activity activity)
        {
            try
            {
                var serviceUri = new Uri(activity.ServiceUrl);
                var connector = new ConnectorClient(serviceUri);
                //await connector.Conversations.SendToConversationAsync(activity.CreateReply($"The channel Id is {activity.ChannelId}"));
                
                if (activity.Type.ToUpper() == "MESSAGE")
                {
                    
                    var luis = await _engine.ProcessMessage(activity);

                    if (luis.intents[0].intent == "GetAccountInfo")
                    {
                        if (luis.entities.Length > 0)
                        {
                            var reply = activity.CreateReply($"You typed: {activity.Text}    Reply: Here is your account information");
                            var account = _accRepository.SingleOrDefault(x => x.AccountId == luis.entities[0].entity);
                            if (activity.ChannelId == "slack")
                            {
                                reply.ChannelData = await _slaceChannelDataService.GenerateChannelSpecificData(reply, account);
                            }
                            else
                            {
                                reply.ChannelData = account;
                            }
                            
                            reply.Attachments = new List<Attachment>();
                            reply.Attachments.Add(new Attachment("application/json", "", account));
                            await connector.Conversations.SendToConversationAsync(reply);
                           
                        }
                        else
                        {
                            await connector.Conversations.SendToConversationAsync(activity.CreateReply($"You typed: {activity.Text}    Reply: Sorry, we cannot find the account by the given account Id"));
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
                            var reply =
                                activity.CreateReply(
                                    $"You typed: {activity.Text}    Reply: Here is the payments information");

                            if (activity.ChannelId == "slack")
                            {
                                reply.ChannelData = await _slaceChannelDataService.GenerateChannelSpecificData(reply, new PaymentData(luis.entities[0].entity, payments));
                            }
                            else
                            {
                                reply.ChannelData = new PaymentData(luis.entities[0].entity, payments);
                            }
                            
                            await connector.Conversations.SendToConversationAsync(reply);
                        }
                        else
                        {
                            var reply = activity.CreateReply($"You typed: {activity.Text}    Reply: I don't understand what you are after, please at least provide a Ual");
                            await connector.Conversations.SendToConversationAsync(reply);
                        }
                    }
                    if (luis.intents[0].intent == "AddPayment")
                    {
                        await connector.Conversations.SendToConversationAsync(activity.CreateReply($"The intent is {luis.intents[0].intent} and entity is {luis.entities[0].entity}"));
                    }
                    if(luis.intents[0].intent == "SendRecReport")
                    {
                        await connector.Conversations.SendToConversationAsync(activity.CreateReply($"You typed: {activity.Text}    Reply: I will send you the report shortly to your email"));
                    }
                  
                }
                else
                {
                    await connector.Conversations.SendToConversationAsync(HandleSystemMessage(activity));
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