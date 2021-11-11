const express = require('express');

const router = express.Router();

router.route('/').get((req, res, next) => {
  return res.json({
    status: 'success',
    message: 'This is the backend API for Hami Nepal Web Application',
  });
});

module.exports = router;
