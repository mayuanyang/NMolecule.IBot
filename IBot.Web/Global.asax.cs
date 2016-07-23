using System.Reflection;
using System.Web;
using System.Web.Http;
using Autofac;
using Autofac.Integration.WebApi;
using IBot.Core;
using IBot.Core.Services;

namespace IBot.Web
{
    public class WebApiApplication : HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
            var builder = new ContainerBuilder();
            // Get your HttpConfiguration.
            var config = GlobalConfiguration.Configuration;

            // Register your Web API controllers.
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            // OPTIONAL: Register the Autofac filter provider.
            builder.RegisterWebApiFilterProvider(config);
            builder.RegisterModule<BotCoreModule>();
            var container = builder.Build();
            container.BeginLifetimeScope();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);

            var sampleDataService = container.Resolve<ISampleDataService>();
            sampleDataService.Setup();
        }
    }
}
