const bcrypt = require("bcrypt");
const SibApiV3Sdk = require("sib-api-v3-sdk");

const User = require("../Module/user");
const Forgetpassword = require("../Module/forgetpassword");
const { v4: uuidv4 } = require("uuid");
exports.getResetpasswordLink = async (req, res, next) => {
  try {
    const email = req.body.email;
    console.log("email", email);
    const user = await User.findOne({ where: { email: email } });
    const ForgetObj = {
      id: uuidv4(),
      userId: user.id,
      isactive: true,
    };

    const forgetPassord_response = await Forgetpassword.create(ForgetObj);

    const sendRestlink = await sendLink(ForgetObj.id, email);
    console.log(sendRestlink);
    Promise.all([forgetPassord_response, sendRestlink])
      .then((data) => {
        res.status(200).json({ message: "success", data: sendRestlink });
      })
      .catch((err) => {
        res.status(400).json({ error: "failed", message: err });
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "failed", message: err });
  }
};

//support function
function sendLink(link_id, email) {
  //  SendinBlue API key

  SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
    process.env.SENDINBLUR_API_KEY;
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

  return transEmailApi.sendTransacEmail({
    sender,
    to: receivers,
    subject: "I sent you a message to verify",
    htmlContent: `
    <h3>Reset password</h3>
    <form action="http://localhost:5004/password/newpassword/${link_id}" method="POST">
    
    <label for="new-password">New Password:</label>
    <input type="password" id="new-password" name="newPassword" required>
    <button type="submit">Reset Password<button>
  </form>`,
  });
}

exports.postNewpassword = async (req, res, next) => {
  try {
    const id = req.params.resetId;
    const password = req.body.newPassword;
    //finding forgetpassword row
    const Forgetobject = await Forgetpassword.findOne({ where: { id: id } });
    //verification
    if (
      Forgetobject.id == id &&
      Forgetobject.isactive == true &&
      password.length > 4
    ) {
      const saltRounds = 10;
      //password encryption
      bcrypt.hash(password, saltRounds, async function (err, hash) {
        if (!err) {
          //user and forget table update
          const user = User.create({ password: hash });
          const update_Forgetobject = Forgetobject.update({
            isactive: false,
          });

          Promise.all([user, update_Forgetobject])
            .then((data) => {
              res.status(200).send(`<h1>password successfully updated</h1>`);
            })
            .catch((err) =>
              res
                .status(400)
                .send(
                  `<h1 style="color: red;">Might be This link expired OR Try Again</h1>`
                )
            );
        } else {
          throw new Error(err);
        }
      });
    } else {
      res
        .status(400)
        .send(
          `<h1 style="color: red;">Might be This link expired OR Try Again</h1>`
        );
    }
  } catch (err) {
    res.status(400).send(`<h1 style="color: red;">400 Error</h1>`);
  }
};
