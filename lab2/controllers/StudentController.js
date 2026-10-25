import { sendJson } from 'tiny-router';
import { loadData, saveData } from '../data.js';

const StudentController = {
  getAll(req, res) {
    try {
      const data = loadData();

      sendJson(res, 200, {
        _links: { self: { href: '/students' } },
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
      sendJson(res, 500, { error: 'Could not read students data' });
    }
  },

  getOne(req, res) {
    try {
      const data = loadData();
      const student = data.students.find((s) => s.ine === req.params.ine);

      if (!student) {
        return sendJson(res, 404, { error: 'Student not found' });
      }

      sendJson(res, 200, student);
    } catch (err) {
      console.error(err);
      sendJson(res, 500, { error: 'Could not read student data' });
    }
  },

  create(req, res) {
    try {
      const student = req.body;

      if (!student || !student.ine) {
        return sendJson(res, 400, { error: 'ine is required' });
      }

      const data = loadData();

      if (data.students.some((s) => s.ine === student.ine)) {
        return sendJson(res, 409, { error: 'Student already exists' });
      }

      data.students.push(student);
      saveData(data);

      sendJson(res, 201, student);
    } catch (err) {
      console.error(err);
      sendJson(res, 500, { error: 'Could not create student' });
    }
  },

  update(req, res) {
    try {
      const data = loadData();
      const index = data.students.findIndex((s) => s.ine === req.params.ine);

      if (index === -1) {
        return sendJson(res, 404, { error: 'Student not found' });
      }

      const updated = { ...data.students[index], ...req.body, ine: req.params.ine };
      data.students[index] = updated;
      saveData(data);

      sendJson(res, 200, updated);
    } catch (err) {
      console.error(err);
      sendJson(res, 500, { error: 'Could not update student' });
    }
  },
};

export default StudentController;
