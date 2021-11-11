const express = require('express')
const newsController = require('../controllers/newsController')
const authController = require('../controllers/authController')

const router = express.Router()

router.route("/")
.get(newsController.getAllNews)
.post(authController.protect,
    authController.restrictTo("admin"),
    newsController.uploadNewsPhoto,
    newsController.resizeNewsPhoto,
    newsController.createNews)

router.route("/:id")
.get(newsController.getSingleNews)
.put(authController.protect,
    authController.restrictTo("admin"),
    newsController.uploadNewsPhoto,
    newsController.resizeNewsPhoto,
    newsController.updateNews)
.delete(authController.protect,
    authController.restrictTo("admin"),
    newsController.deleteNews)

module.exports = router;