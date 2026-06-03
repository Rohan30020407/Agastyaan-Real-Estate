const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { verifyToken, requireRole } = require("../middleware/auth");
const { addProperty, listProperties, getPropertyById, updateProperty, deleteProperty } = require("../controllers/propertyController");

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });

router.get("/", listProperties);
router.get("/:id", getPropertyById);
router.post("/", verifyToken, requireRole(["admin", "sub-admin"]), upload.array("images", 6), addProperty);
router.put("/:id", verifyToken, requireRole(["admin", "sub-admin"]), updateProperty);
router.delete("/:id", verifyToken, requireRole(["admin", "sub-admin"]), deleteProperty);

module.exports = router;
