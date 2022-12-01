// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const SibApiV3Sdk = require('sib-api-v3-sdk');

export default function handler(req, res) {
  
  const { email, first_name, last_name, subject, text } = req.body;

  let defaultClient = SibApiV3Sdk.ApiClient.instance;

  let apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.SEND_IN_BLUE_KEY;

  console.log("apiKey", process.env.SEND_IN_BLUE_KEY)

  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = `<html><body><h1>${text}</h1></body></html>`;
  sendSmtpEmail.sender = { "name": "Wifi & Coffee", "email": "wifiandcoffeeclub@gmail.com" };
  sendSmtpEmail.to = [{ "email": email, "name": first_name + " " + last_name }];
  // sendSmtpEmail.cc = [{ "email": "example2@example2.com", "name": "Janice Doe" }];
  // sendSmtpEmail.bcc = [{ "email": "John Doe", "name": "example@example.com" }];
  sendSmtpEmail.replyTo = { "email": "wifiandcoffeeclub@gmail.com", "name": "Wifi & Coffee" };
  // sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
  // sendSmtpEmail.params = { "parameter": "My param value", "subject": "New Subject" };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
  }, function (error) {
    console.error(error);
  });

}
