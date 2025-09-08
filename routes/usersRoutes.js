const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/me", auth, userController.getMyProfile);
router.put(
  "/update/profile",
  auth,
  upload.single("file"),
  userController.updateProfilePhoto
);
router.get("/", auth, userController.getAllUsers);
router.put("/update", auth, userController.getUserByUpdate);

module.exports = router;
