const router = require("express").Router();
const { login, logout } = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");
const { me } = require("../controllers/userController");

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, me);

module.exports = router;
