import { sendJson } from 'tiny-router';
import { loadData, saveData } from '../data.js';

const ProfController = {
  getAll(req, res) {
    try {
      const data = loadData();

      sendJson(res, 200, {
        _links: { self: { href: '/profs' } },
        profs: data.profs.map((p) => ({
          lastname: p.lastname,
          firstname: p.firstname,
          number: p.number,
          _links: {
            self: {
              href: `/profs/${p.number}`,
            },
          },
        })),
      });
    } catch (err) {
      console.error(err);
      sendJson(res, 500, { error: 'Could not read profs data' });
    }
  },

  getOne(req, res) {
    try {
      const data = loadData();
      const prof = data.profs.find((p) => p.number === req.params.number);

      if (!prof) {
        return sendJson(res, 404, { error: 'Prof not found' });
      }

      sendJson(res, 200, prof);
    } catch (err) {
      console.error(err);
      sendJson(res, 500, { error: 'Could not read prof data' });
    }
  },

  create(req, res) {
    try {
      const prof = req.body;

      if (!prof || !prof.number) {
        return sendJson(res, 400, { error: 'number is required' });
      }

      const data = loadData();

      if (data.profs.some((p) => p.number === prof.number)) {
        return sendJson(res, 409, { error: 'Prof already exists' });
      }

      data.profs.push(prof);
      saveData(data);

      sendJson(res, 201, prof);
    } catch (err) {
      console.error(err);
      sendJson(res, 500, { error: 'Could not create prof' });
    }
  },

  update(req, res) {
    try {
      const data = loadData();
      const index = data.profs.findIndex((p) => p.number === req.params.number);

      if (index === -1) {
        return sendJson(res, 404, { error: 'Prof not found' });
      }

      const updated = { ...data.profs[index], ...req.body, number: req.params.number };
      data.profs[index] = updated;
      saveData(data);

      sendJson(res, 200, updated);
    } catch (err) {
      console.error(err);
      sendJson(res, 500, { error: 'Could not update prof' });
    }
  },
};

export default ProfController;
