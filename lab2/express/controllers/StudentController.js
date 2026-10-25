import { loadData, saveData } from "../data.js";

const StudentController = {
  getAll(req, res) {
    try {
      const data = loadData();

      res.status(200).json({
        _links: { self: { href: "/students" } },
        students: data.students.map((s) => ({
          lastname: s.lastname,
          firstname: s.firstname,
          _links: {
            self: {
              href: `/students/${s.ine}`,
            },
          },
        })),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not read students data" });
    }
  },

  getOne(req, res) {
    try {
      const data = loadData();
      const student = data.students.find((s) => s.ine === req.params.ine);

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.status(200).json(student);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not read student data" });
    }
  },

  create(req, res) {
    try {
      const student = req.body;

      if (!student || !student.ine) {
        return res.status(400).json({ error: "ine is required" });
      }

      const data = loadData();

      if (data.students.some((s) => s.ine === student.ine)) {
        return res.status(409).json({ error: "Student already exists" });
      }

      data.students.push(student);
      saveData(data);

      res.status(201).json(student);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not create student" });
    }
  },

  update(req, res) {
    try {
      const data = loadData();
      const index = data.students.findIndex((s) => s.ine === req.params.ine);

      if (index === -1) {
        return res.status(404).json({ error: "Student not found" });
      }

      const updated = { ...data.students[index], ...req.body, ine: req.params.ine };
      data.students[index] = updated;
      saveData(data);

      res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not update student" });
    }
  },
};
export default StudentController;
