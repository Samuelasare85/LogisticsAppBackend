const router = require('express').Router();
const prisma = require('../../middlewares/prisma');
const moment = require('moment');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { validatePassword } = require('../../helpers/validations/auth/validateAuth');
const sendMail = require('../../utils/sendMail');


/* eslint-disable no-undef */
const saltRounds = parseInt(process.env.SALT_ROUNDS);

router.patch('/:token', async (req, res) => {
    const token = req.params.token;
  if (!token) return res.status(400).json({
    'status': 'error',
    'error': 'Invalid token'
  });

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      password_reset_token: hashedToken,
      password_reset_expires : {
        gt: moment.utc(moment())
      }
      }
    });
  if (!user) return res.status(404).json({
    'status': 'error',
    'error': 'User does not exist'
  });

  try {
    await validatePassword(req.body);
  }
  catch (error) {
    return res.status(404).send({ 'error': error.errors[0]});
  }
    
  let password = '';

  await bcrypt
  .hash(req.body.password, saltRounds)
  .then((hash) => (password = hash));

  await prisma.user.update({
      where: { id: user.id },
      data : {
          password_reset_token: null,
          password_reset_expires: null,
          password_changed_at: moment.utc(moment()),
          password: password
      }
  })
  .then((user) => {
    try {
      const details = {
          from: process.env.SOURCE_EMAIL,
          to: user.email_address,
          subject : 'Password Reset Successful😉',
          full_name: user.full_name,
          instruction: 'Your password has been reset.',
          emailFile: 'signUpTemplate.ejs'
      };
      sendMail(details);
  } catch (error) {
      return res.status(400).json(
          {
              status: 'error',
              error : error
          });
  }
    return res.json({
      status : 'success',
      message: 'Password reset completed successfully'
  });
})
  .catch(() => res.status(404).json({
      'status': 'error',
      'error': 'User does not exist'
    }));
});

/* eslint-enable no-undef */

module.exports = router;