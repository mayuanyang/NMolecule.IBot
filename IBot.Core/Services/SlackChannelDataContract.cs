using System.Collections;
using System.Collections.Generic;
using Microsoft.Bot.Connector;

namespace IBot.Core.Services
{
    public class SlackChannelDataContract
    {
        private readonly Activity _activity;

        public SlackChannelDataContract(Activity activity, dynamic data)
        {
            _activity = activity;
            var fields = data.GetType().GetProperties();
            var fieldsToReturn = new List<Field>();
            foreach (var f in fields)
            {
                var title = f.Name;
                var value = f.GetValue(data, null);
                fieldsToReturn.Add(new Field {title = title, value = value.ToString()});
            }
            text = activity.Text;
            attachments = new[]
            {
                new Attachment
                {
                    title = "",
                    fields = fieldsToReturn.ToArray(),

                }
            };

        }

        public string type => "message";
        public string locale => _activity.Locale;
        public string channelId => "slack";
        public Conversation conversation => new Conversation {id = _activity.Conversation.Id, topic = _activity.Conversation.Name};
        public From from => new From {id=_activity.From.Id, name = _activity.From.Name};
        public Recipient recipient => new Recipient {id=_activity.Recipient.Id, name = _activity.Recipient.Name};
        public string text { get; set; }
        public Attachment[] attachments { get; set; }


        public class Conversation
        {
            public string id { get; set; }
            public string topic { get; set; }
        }

        public class From
        {
            public string id { get; set; }
            public string name { get; set; }
        }

        public class Recipient
        {
            public string id { get; set; }
            public string name { get; set; }
        }

        public class Attachment
        {
            public string title { get; set; }
            public Field[] fields { get; set; }
            public string text { get; set; }
            public string fallback { get; set; }
            public string callback_id { get; set; }
            public string color { get; set; }
            public string attachment_type => "default";
            public Action[] actions { get; set; }
        }

        public class Field
        {
            public string title { get; set; }
            public string value { get; set; }
            public bool _short { get; set; }
        }

        public class Action
        {
            public string name { get; set; }
            public string text { get; set; }
            public string type { get; set; }
            public string value { get; set; }
        }

    }
}
