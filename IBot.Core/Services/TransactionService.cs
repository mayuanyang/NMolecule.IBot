using System.Collections.Generic;
using System.Linq;
using IBot.Core.Entities;
using IBot.Core.Forms;
using IBot.Core.Repositories;

namespace IBot.Core.Services
{
    class TransactionService : ITransactionService
    {
        private readonly IRepository<Transaction> _txRepository;

        public TransactionService(IRepository<Transaction> txRepository)
        {
            _txRepository = txRepository;
        }

        public IEnumerable<Transaction> Search(Luis luis)
        {
            var ual = luis.entities.FirstOrDefault(x => x.type.ToUpper() == "UAL");
            var paymentProcessor = luis.entities.FirstOrDefault(x => x.type.ToUpper().IndexOf("PAYMENTPROCESSOR") > -1);
            var transactionType = luis.entities.FirstOrDefault(x => x.type.ToUpper().IndexOf("TRANSACTIONTYPE") > -1);

            IEnumerable<Transaction> payments = null;
            
            if (paymentProcessor != null && transactionType != null)
            {
                PaymentProcessor actualPaymentProcessor = GetPaymentProcessor(paymentProcessor);

                payments = _txRepository.Where(x => x.AccountId == ual.entity && x.PaymentProcessor == actualPaymentProcessor.ToString()).ToList();
            }
            else if(paymentProcessor == null && transactionType != null)
            {
                var txType = "";
                if (transactionType.entity.ToUpper().Contains("CHARGE"))
                {
                    txType = TransactionType.Charge.ToString();
                }
                else if (transactionType.entity.ToUpper().Contains("RECEIPT") || transactionType.entity.ToUpper().Contains("PAYMENT"))
                {
                    txType = TransactionType.Receipt.ToString();
                }
                payments = _txRepository.Where(x => x.AccountId == ual.entity && x.TransactionType == txType.ToString()).ToList();
            }
            else if (paymentProcessor != null && transactionType == null)
            {
                PaymentProcessor actualPaymentProcessor = GetPaymentProcessor(paymentProcessor);
                payments = _txRepository.Where(x => x.AccountId == ual.entity && x.PaymentProcessor == actualPaymentProcessor.ToString()).ToList();
            }
            else
            {
                payments = _txRepository.Where(x => x.AccountId == ual.entity).ToList();
            }

            return payments;
        }

        private static PaymentProcessor GetPaymentProcessor(Entity paymentProcessor)
        {
            var actualPaymentProcessor = PaymentProcessor.AusPost;
            if (paymentProcessor.entity.ToUpper().Contains("BPAY"))
            {
                actualPaymentProcessor = PaymentProcessor.BPay;
            }
            else if (paymentProcessor.entity.ToUpper().Contains("AUSPOST") ||
                     paymentProcessor.entity.ToUpper().Contains("AUSTRALIA POST"))
            {
                actualPaymentProcessor = PaymentProcessor.AusPost;
            }
            else if (paymentProcessor.entity.ToUpper().Contains("CREDIT"))
            {
                actualPaymentProcessor = PaymentProcessor.CreditCard;
            }
            else if (paymentProcessor.entity.ToUpper().Contains("BANKSTATEMENT") ||
                     paymentProcessor.entity.ToUpper().Contains("BANK STATEMENT"))
            {
                actualPaymentProcessor = PaymentProcessor.BankStatement;
            }
            else if (paymentProcessor.entity.ToUpper().Contains("DEBIT"))
            {
                actualPaymentProcessor = PaymentProcessor.DirectDebit;
            }
            else if (paymentProcessor.entity.ToUpper().Contains("MANUAL"))
            {
                actualPaymentProcessor = PaymentProcessor.ManualPayment;
            }

            return actualPaymentProcessor;
        }
    }
}