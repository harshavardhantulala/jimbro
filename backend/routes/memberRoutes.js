const express = require("express");
const router = express.Router();
const {
  getAllMembers,
  addMember,
  deleteMember,
} = require("../controllers/memberController");

router.get("/", getAllMembers);
router.post("/", addMember);
router.delete("/:id", deleteMember);

module.exports = router;
