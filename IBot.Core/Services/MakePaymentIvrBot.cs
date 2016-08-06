using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Calling;
using Microsoft.Bot.Builder.Calling.Events;
using Microsoft.Bot.Builder.Calling.ObjectModel.Contracts;
using Microsoft.Bot.Builder.Calling.ObjectModel.Misc;
using Serilog;

namespace IBot.Core.Services
{
    public class MakePaymentIvrBot : IDisposable, ICallingBot
    {
        private readonly ILogger _logger;
        // below are the dtmf keys required for each of option, will be used for parsing results of recognize
        private const string MakePayment = "1";
        private const string CheckAccountBalance = "2";
        private const string CreditCardPayment = "1";
        private const string DirectDebitPayment = "2";


        private readonly Dictionary<string, CallState> _callStateMap = new Dictionary<string, CallState>();

        public ICallingBotService CallingBotService { get; private set; }

        public MakePaymentIvrBot(ICallingBotService callingBotService, ILogger logger)
        {
            _logger = logger;
            _logger.Information("Start SimpleIVRBot");
            if (callingBotService == null)
                throw new ArgumentNullException(nameof(callingBotService));

            CallingBotService = callingBotService;
            CallingBotService.OnIncomingCallReceived += OnIncomingCallReceived;
            CallingBotService.OnPlayPromptCompleted += OnPlayPromptCompleted;
            CallingBotService.OnRecordCompleted += OnRecordCompleted;
            CallingBotService.OnRecognizeCompleted += OnRecognizeCompleted;
            CallingBotService.OnHangupCompleted += OnHangupCompleted;

        }

        private Task OnIncomingCallReceived(IncomingCallEvent incomingCallEvent)
        {
            _logger.Information(nameof(OnIncomingCallReceived));
            var id = Guid.NewGuid().ToString();
            _callStateMap[incomingCallEvent.IncomingCall.Id] = new CallState();
            incomingCallEvent.ResultingWorkflow.Actions = new List<ActionBase>
                {
                    new Answer { OperationId = id },
                    GetPromptForText(IvrOptions.WelcomeMessage)
                };

            return Task.FromResult(true);
        }

        private Task OnHangupCompleted(HangupOutcomeEvent hangupOutcomeEvent)
        {
            _logger.Information(nameof(OnHangupCompleted));
            hangupOutcomeEvent.ResultingWorkflow = null;
            return Task.FromResult(true);
        }

        private Task OnPlayPromptCompleted(PlayPromptOutcomeEvent playPromptOutcomeEvent)
        {
            _logger.Information(nameof(OnPlayPromptCompleted));
            var callStateForClient = _callStateMap[playPromptOutcomeEvent.ConversationResult.Id];
            callStateForClient.InitiallyChosenMenuOption = null;
            SetupInitialMenu(playPromptOutcomeEvent.ResultingWorkflow);

            return Task.FromResult(true);
        }

        private Task OnRecordCompleted(RecordOutcomeEvent recordOutcomeEvent)
        {
            _logger.Information(nameof(OnRecordCompleted));
            var id = Guid.NewGuid().ToString();
            recordOutcomeEvent.ResultingWorkflow.Actions = new List<ActionBase>
                {
                    GetPromptForText(IvrOptions.Ending),
                    new Hangup { OperationId = id }
                };
            recordOutcomeEvent.ResultingWorkflow.Links = null;
            _callStateMap.Remove(recordOutcomeEvent.ConversationResult.Id);
            return Task.FromResult(true);
        }

        private Task OnRecognizeCompleted(RecognizeOutcomeEvent recognizeOutcomeEvent)
        {
            _logger.Information("recognizeOutcomeEvent {@recognizeOutcomeEvent}", recognizeOutcomeEvent);
            var callStateForClient = _callStateMap[recognizeOutcomeEvent.ConversationResult.Id];
            _logger.Information("callStateForClient {callStateForClient}", callStateForClient);
            switch (callStateForClient.InitiallyChosenMenuOption)
            {
                case null:
                    ProcessMainMenuSelection(recognizeOutcomeEvent, callStateForClient);
                    break;
                case MakePayment:
                    ProcessPaymentsSelection(recognizeOutcomeEvent, callStateForClient);
                    break;
                default:
                    SetupInitialMenu(recognizeOutcomeEvent.ResultingWorkflow);
                    break;
            }
            return Task.FromResult(true);
        }

        private void SetupInitialMenu(Workflow workflow)
        {
            _logger.Information(nameof(SetupInitialMenu));
            workflow.Actions = new List<ActionBase> { CreateIvrOptions(IvrOptions.MainMenuPrompt, 5, false) };
        }


        private Recognize CreatePaymentsMenu()
        {
            return CreateIvrOptions(IvrOptions.PaymentPrompt, 2, true);
        }



        private void ProcessMainMenuSelection(RecognizeOutcomeEvent outcome, CallState callStateForClient)
        {
            if (outcome.RecognizeOutcome.Outcome != Outcome.Success)
            {
                SetupInitialMenu(outcome.ResultingWorkflow);
                return;
            }

            switch (outcome.RecognizeOutcome.ChoiceOutcome.ChoiceName)
            {
                case MakePayment:
                    callStateForClient.InitiallyChosenMenuOption = MakePayment;
                    outcome.ResultingWorkflow.Actions = new List<ActionBase> { CreatePaymentsMenu() };
                    break;
                case CheckAccountBalance:
                    callStateForClient.InitiallyChosenMenuOption = CheckAccountBalance;
                    outcome.ResultingWorkflow.Actions = new List<ActionBase>
                    {
                        new Recognize()
                    {
                        OperationId = Guid.NewGuid().ToString(),
                        PlayPrompt = GetPromptForText(IvrOptions.UalPrompt),
                        CollectDigits = new CollectDigits() {MaxNumberOfDtmfs = 16, StopTones =new [] { '#' } },
                        InitialSilenceTimeoutInSeconds = 5,
                        InterdigitTimeoutInSeconds = 5,
                        BargeInAllowed = true

                    },
                        GetPromptForText("Your account balance is $480.00")
                    };
                    break;
                default:
                    SetupInitialMenu(outcome.ResultingWorkflow);
                    break;
            }
        }


        private void ProcessPaymentsSelection(RecognizeOutcomeEvent outcome, CallState callStateForClient)
        {
            if (outcome.RecognizeOutcome.Outcome != Outcome.Success)
            {
                outcome.ResultingWorkflow.Actions = new List<ActionBase> { CreatePaymentsMenu() };
                return;
            }

            var id = Guid.NewGuid().ToString();
            switch (outcome.RecognizeOutcome.ChoiceOutcome.ChoiceName)
            {
                case CreditCardPayment:

                    outcome.ResultingWorkflow.Actions = new List<ActionBase>
                        {
                        new Recognize()
                    {
                        OperationId = id,
                        PlayPrompt = GetPromptForText(IvrOptions.CreditCardNumberPrompt),
                        CollectDigits = new CollectDigits() {MaxNumberOfDtmfs = 16, StopTones =new [] { '#' } },
                        InitialSilenceTimeoutInSeconds = 5,
                        InterdigitTimeoutInSeconds = 5,
                        BargeInAllowed = true,
                      
                        
                    },
                        
                        GetPromptForText("Thanks for your payment")

            };
                    break;
                case DirectDebitPayment:

                    outcome.ResultingWorkflow.Actions = new List<ActionBase>
                        {
                        new Recognize()
                    {
                        OperationId = id,
                        PlayPrompt = GetPromptForText(IvrOptions.CreditCardNumberPrompt),
                        CollectDigits = new CollectDigits() {MaxNumberOfDtmfs = 16, StopTones =new [] { '#' } },
                        InitialSilenceTimeoutInSeconds = 5,
                        InterdigitTimeoutInSeconds = 5,
                        BargeInAllowed = true

                    }
                        };
                    break;
                default:
                    callStateForClient.InitiallyChosenMenuOption = null;
                    CreatePaymentsMenu();
                    break;
            }
        }

        private static Recognize CreateIvrOptions(string textToBeRead, int numberOfOptions, bool includeBack)
        {

            if (numberOfOptions > 9)
                throw new Exception("too many options specified");

            var id = Guid.NewGuid().ToString();
            var choices = new List<RecognitionOption>();
            for (int i = 1; i <= numberOfOptions; i++)
            {
                choices.Add(new RecognitionOption { Name = Convert.ToString(i), DtmfVariation = (char)('0' + i) });
            }
            if (includeBack)
                choices.Add(new RecognitionOption { Name = "#", DtmfVariation = '#' });
            var recognize = new Recognize
            {
                OperationId = id,
                PlayPrompt = GetPromptForText(textToBeRead),
                BargeInAllowed = true,
                Choices = choices
            };

            return recognize;
        }

        private static void SetupRecording(Workflow workflow)
        {
            var id = Guid.NewGuid().ToString();

            var prompt = GetPromptForText(IvrOptions.LeaveMessage);
            var record = new Record
            {
                OperationId = id,
                PlayPrompt = prompt,
                MaxDurationInSeconds = 10,
                InitialSilenceTimeoutInSeconds = 5,
                MaxSilenceTimeoutInSeconds = 2,
                PlayBeep = true,
                StopTones = new List<char> { '#' }
            };
            workflow.Actions = new List<ActionBase> { record };
        }

        private static PlayPrompt GetPromptForText(string text)
        {
            var prompt = new Prompt { Value = text, Voice = VoiceGender.Male };
            return new PlayPrompt { OperationId = Guid.NewGuid().ToString(), Prompts = new List<Prompt> { prompt } };
        }

        #region Implementation of IDisposable

        public void Dispose()
        {
            if (CallingBotService != null)
            {
                CallingBotService.OnIncomingCallReceived -= OnIncomingCallReceived;
                CallingBotService.OnPlayPromptCompleted -= OnPlayPromptCompleted;
                CallingBotService.OnRecordCompleted -= OnRecordCompleted;
                CallingBotService.OnRecognizeCompleted -= OnRecognizeCompleted;
                CallingBotService.OnHangupCompleted -= OnHangupCompleted;
            }
        }

        #endregion

        private class CallState
        {
            public string InitiallyChosenMenuOption { get; set; }
        }
    }

}