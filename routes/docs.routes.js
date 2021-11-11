const express = require('express');
const docsController = require('../controllers/docsController');

const router = express.Router();

router
    .route('/')
    .get(docsController.index);

router
    .route('/get-api-list')
    .get(docsController.getApiList);


module.exports = router;
