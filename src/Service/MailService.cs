using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using Microsoft.WWV.Models;
using MimeKit;
using System;
using System.IO;
using System.Reflection;

namespace Microsoft.WWV.Service
{
    public class MailService : IDisposable
    {
        private readonly IConfiguration _config;
        private readonly string _defaultSender;

        public MailService(IConfiguration config)
        {
            this._config = config;
            _defaultSender = this._config["SmtpSetting:Sender"];
        }

        private SmtpClient CreateSmtpClient()
        {
            var _client = new SmtpClient();

            // For demo-purposes, accept all SSL certificates (in case the server supports STARTTLS)
            _client.ServerCertificateValidationCallback = (s, c, h, e) => true;

            _client.Connect(this._config["SmtpSetting:SmtpServer"], 587, false);

            // Note: only needed if the SMTP server requires authentication
            _client.Authenticate(this._config["SmtpSetting:User"], this._config["SmtpSetting:Password"]);

            return _client;
        }

        private static string ReadTemplate(string templatePath)
        {
            var assembly = Assembly.GetExecutingAssembly();
            using (Stream stream = assembly.GetManifestResourceStream(templatePath))
            {
                using (StreamReader reader = new StreamReader(stream))
                {
                    string result = reader.ReadToEnd();
                    return result;
                }
            }
        }

        public void SendEmail(Event evt, Registration reg)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Microsoft Volunteering CH", this._defaultSender));
            message.To.Add(new MailboxAddress(reg.UserId));
            message.Subject = "Registration confirmation: " + evt.Name;

            var bodyBuilder = new BodyBuilder();
            bodyBuilder.TextBody = "HTML message can't be displayed.";

            var template = MailService.ReadTemplate(EmailTemplates.EventSignupConfirmation);
            bodyBuilder.HtmlBody = MailService.ReplaceTokens(template, evt, reg);
            message.Body = bodyBuilder.ToMessageBody();

            try
            {
                using (var client = this.CreateSmtpClient())
                {
                    client.Send(message);
                    client.Disconnect(true);
                }
            }
            catch (Exception ex)
            {

            }
            return;
        }

        private static string ReplaceTokens(string template, Event evt, Registration reg)
        {
            //TODO: replace tokens. should use Razor in the future
            template = template.Replace("[name1]", reg.Name1);
            template = template.Replace("[EventName]", evt.Name);
            template = template.Replace("[EventLocation]", evt.EventLocation);
            template = template.Replace("[Eventdate]", evt.Eventdate.Date.ToString());
            template = template.Replace("[EventEndDate]", evt.EventEndDate.Date.ToString());
            template = template.Replace("[OwnerName1]", evt.OwnerName1);
            template = template.Replace("[OwnerName2]", evt.OwnerName2);

            return template;
        }

        public void Dispose()
        {
        }
    }
}
