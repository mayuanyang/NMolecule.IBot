using System;
using Autofac;
using IBot.Core.Repositories;
using Serilog;
using Serilog.Configuration;
using Serilog.Events;

namespace IBot.Core
{
    public class BotCoreModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            base.Load(builder);
            builder.RegisterType<LuisProcessEngine>().AsImplementedInterfaces().InstancePerLifetimeScope();
            builder.RegisterGeneric(typeof(InMemoryRepository<>)).AsImplementedInterfaces().SingleInstance();

            builder.Register<ILogger>((c, p) => new LoggerConfiguration()
            .WriteTo.Seq("http://localhost:5341", LogEventLevel.Debug)
               .CreateLogger())
               .SingleInstance();
        }
    }
}
