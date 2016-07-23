using System.ComponentModel;

namespace IBot.Core.Forms
{
    public enum PaymentProcessor
    {
        [Description("AusPost")]
        AusPost,
        [Description("BPay")]
        BPay,
        [Description("BankStatement")]
        BankStatement,
        [Description("Manual Payment")]
        ManualPayment,
        [Description("Direct Debit")]
        DirectDebit,
        [Description("Credit Card")]
        CreditCard
    }
}
