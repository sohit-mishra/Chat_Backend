const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });
router.get("/me", auth, userController.getMyProfile);
router.put("/me/update", auth, upload.single("avatar"), userController.updateProfile);
router.get("/", auth, userController.getAllUsers);
router.get("/:id", auth, userController.getUserById);

module.exports = router;
