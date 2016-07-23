using Autofac;
using IBot.Core.Repositories;
using IBot.Core.Services;
using Serilog;
using Serilog.Events;

namespace IBot.Core
{
    public class BotCoreModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            base.Load(builder);
            builder.RegisterType<LuisProcessEngine>().AsImplementedInterfaces().InstancePerLifetimeScope();
            builder.RegisterType<SlackChannelDataService>().AsImplementedInterfaces();
            builder.RegisterType<TransactionService>().AsImplementedInterfaces();
            builder.RegisterType<AccountService>().AsImplementedInterfaces();
            builder.RegisterType<SampleDataService>().AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(InMemoryRepository<>)).AsImplementedInterfaces().SingleInstance();

            builder.Register<ILogger>((c, p) => new LoggerConfiguration()
            .WriteTo.Seq("http://localhost:5341", LogEventLevel.Debug)
               .CreateLogger())
               .SingleInstance();
        }
    }
}
