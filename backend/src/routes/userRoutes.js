const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { verifyToken, requireRole } = require("../middleware/auth");
const { me, updateProfile, changePassword, uploadAvatar, listUsers, createUser, updateUser, deleteUser, analytics } = require("../controllers/userController");

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });

router.get("/me", verifyToken, me);
router.put("/profile", verifyToken, updateProfile);
router.post("/change-password", verifyToken, changePassword);
router.post("/avatar", verifyToken, upload.single("avatar"), uploadAvatar);
router.get("/", verifyToken, requireRole(["admin", "sub-admin"]), listUsers);
router.get("/analytics/summary", verifyToken, requireRole(["admin", "sub-admin"]), analytics);
router.post("/", verifyToken, requireRole(["admin"]), createUser);
router.put("/:id", verifyToken, requireRole(["admin"]), updateUser);
router.delete("/:id", verifyToken, requireRole(["admin"]), deleteUser);

module.exports = router;
