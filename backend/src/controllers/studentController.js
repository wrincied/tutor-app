const Student = require('../models/student');

// GET /api/students
exports.getAll = async (req, res) => {
  const students = await Student.find({ tutor_id: req.user.id }).sort({ createdAt: -1 });
  res.json(students);
};

// GET /api/students/:id
exports.getOne = async (req, res) => {
  const student = await Student.findOne({ _id: req.params.id, tutor_id: req.user.id });
  if (!student) return res.status(404).json({ message: 'Ученик не найден' });
  res.json(student);
};

// POST /api/students
exports.create = async (req, res) => {
  const { name, rate_per_hour, timezone } = req.body;
  const student = await Student.create({
    tutor_id: req.user.id,
    name,
    rate_per_hour,
    timezone: timezone || 'Europe/Moscow',
  });
  res.status(201).json(student);
};

// PUT /api/students/:id
exports.update = async (req, res) => {
  const { name, rate_per_hour, timezone, auto_debit_enabled } = req.body;
  const student = await Student.findOneAndUpdate(
    { _id: req.params.id, tutor_id: req.user.id },
    { name, rate_per_hour, timezone, auto_debit_enabled },
    { new: true, runValidators: true },
  );
  if (!student) return res.status(404).json({ message: 'Ученик не найден' });
  res.json(student);
};

// DELETE /api/students/:id
exports.remove = async (req, res) => {
  const student = await Student.findOneAndDelete({ _id: req.params.id, tutor_id: req.user.id });
  if (!student) return res.status(404).json({ message: 'Ученик не найден' });
  res.json({ message: 'Удалён' });
};

// POST /api/students/:id/topup
exports.topup = async (req, res) => {
  const { lessons } = req.body;
  if (!lessons || lessons < 1) return res.status(400).json({ message: 'Укажите количество уроков' });
  const student = await Student.findOneAndUpdate(
    { _id: req.params.id, tutor_id: req.user.id },
    { $inc: { balance_lessons: lessons } },
    { new: true },
  );
  if (!student) return res.status(404).json({ message: 'Ученик не найден' });
  res.json(student);
};
