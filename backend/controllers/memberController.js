const Member = require("../models/Member");

exports.getAllMembers = async (req, res) => {
  const members = await Member.find();
  res.json(members);
};

exports.addMember = async (req, res) => {
  console.log("➡️ POST /api/members called");
  const { name, phone, start, end } = req.body;
  const member = new Member({ name, phone, start, end });
  await member.save();
  res.json({ message: "Member added", member });
};
exports.deleteMember = async (req, res) => {
  const { id } = req.params;
  await Member.findByIdAndDelete(id);
  res.json({ message: "Member deleted" });
};
