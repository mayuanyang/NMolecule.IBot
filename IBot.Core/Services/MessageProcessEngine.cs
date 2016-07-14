using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Bot.Connector;
using Newtonsoft.Json;

namespace IBot.Core
{
    public class MessageProcessEngine : IMessageProcessEngine
    {
        public async Task<Luis> ProcessMessage(Activity message)
        {
            using (var client = new HttpClient())
            {
                var uri =
                    @"https://api.projectoxford.ai/luis/v1/application?id=a0ffd934-8011-4b7b-bbbf-24379ec85c85&subscription-key=cb04dc2110674602ad2a8f991c24127a&q=" + message.Text;

                var response = await client.GetAsync(uri);
                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    var data = JsonConvert.DeserializeObject<Luis>(jsonResponse);
                    return data;
                }
            }
            return null;
        }
    }
}
