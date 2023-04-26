
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const PasswordRequests = require('../models/password-requests-model');
const User = require('../models/user-model');
const Sib = require('../services/Sib-services');

exports.forgotPassword = async (req, res) => {
  try {
    const sender = {
      name: process.env.EMAIL_SENDER_NAME,
      email: process.env.EMAIL_SENDER_ADDRESS,
    };

    const receiver = [{ email: req.body.email }];

    const reqId = uuidv4();
    const user = await User.findOne({ where: { email: req.body.email }});

    if (user) {
      await PasswordRequests.create({
        userId: user.id,
        isActive: true,
        id: reqId,
      });

      const subject = 'Sending with SendGrid is Fun';
      const textContent = 'and easy to do anywhere, even with Node.js';
      const htmlContent = '<a href="{{params.passwordURL}}">Reset password</a>';
      const params = {
        passwordURL: 'http://localhost:3000/password/resetpassword/' + reqId,
      };

      await Sib.sendEmail(sender, receiver, subject, textContent, htmlContent, params);
      return res.status(200).json({ message: 'Email sent successfully' });
    } else throw new Error('That email does not exist in records');
  } catch (err) {
    console.log(err);
  }
};

exports.getPasswordUpdateForm = async (req, res) => {
  try {
    const id = req.params.reqId;
    const passwordRequest = await PasswordRequests.findOne({ where: { id }});
    if (passwordRequest && passwordRequest.isActive) {
      return res.status(200).send(`<html>
        <script>
            function formsubmitted(e){
                e.preventDefault();
                console.log('called')
            }
        </script>
        <form action="/password/updatepassword/${id}" method="get">
            <label for="newpassword">Enter New password</label>
            <input name="newpassword" type="password" required></input>
            <button>reset password</button>
        </form>
    </html>`,
      );
    } else return res.status(401).json({ message: 'Reset link expired/invalid' });
  } catch (err) {
    console.log(err);
  }
};

exports.setPassword = async (req, res) => {
  try {
    // store password, make isActive for request false.
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;
    const passwordRequest = await PasswordRequests.findOne({ where: {
      id: resetpasswordid,
    }});
    const user = await User.findOne({ where: {
      id: passwordRequest.userId,
    }});
    if (user) {
      bcrypt.hash(newpassword, 10, (err, hash) => {
        const p1 = user.update({ password: hash });
        const p2 = passwordRequest.update({ isActive: false });
        Promise.all([p1, p2]).then(_ => {
          res.status(201).json({ message: 'Successfully updated new password' });
        });
      });
    } else return res.status(404).json({ error: 'No user Exists', success: false });
  } catch (err) {
    return res.status(403).json({ error: err, success: false });
  }
};
