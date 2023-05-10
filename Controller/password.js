const SibApiV3Sdk = require("sib-api-v3-sdk");

exports.getResetpasswordLink = (req, res, next) => {
  const email = req.body.email;
  console.log("email", email);

  //  SendinBlue API key
  const API_KEY =
    "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";

  SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey = API_KEY;
  // Create an instance of the SendinBlue client

  const transEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

  // Set the sender
  const sender = {
    name: "sampath",
    email: "bsampath11790@gmail.com",
  };

  const receivers = [
    {
      email: email,
    },
  ];

  transEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      subject: "I sent you a message to verify",
      htmlContent: "Some text",
    })

    .then((response) => {
      //   console.log("Email sent successfully!");
      //   console.log(response);
      res.status(200).json({ message: "success", data: response });
    })
    .catch((err) => {
      //   console.error("Error sending email:", err);
      res.status(400).json({ error: "failed", message: err });
    });
};
