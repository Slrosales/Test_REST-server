import { sendJson } from 'tiny-router';
import { loadData, saveData } from '../data.js';

const ModuleController = {
  getAll(req, res) {
    try {
      const data = loadData();

      sendJson(res, 200, {
        _links: { self: { href: '/modules' } },
        modules: data.modules.map((m) => ({
          name: m.code_module,
          _links: {
            self: {
              href: `/modules/${m.code_module}`,
            },
          },
        })),
      });
    } catch (err) {
      console.error(err);
      sendJson(res, 500, { error: 'Could not read module data' });
    }
  },

  getOne(req, res) {
    try {
      const data = loadData();
      const module = data.modules.find((m) => m.code_module === req.params.code_module);

      if (!module) {
        return sendJson(res, 404, { error: 'Module not found' });
      }

      sendJson(res, 200, module);
    } catch (err) {
      console.error(err);
      sendJson(res, 500, { error: 'Could not read module data' });
    }
  },

  create(req, res) {
    try {
      const module = req.body;

      if (!module || !module.code_module) {
        return sendJson(res, 400, { error: 'code_module is required' });
      }

      const data = loadData();

      if (data.modules.some((m) => m.code_module === module.code_module)) {
        return sendJson(res, 409, { error: 'Module already exists' });
      }

      data.modules.push(module);
      saveData(data);

      sendJson(res, 201, module);
    } catch (err) {
      console.error(err);
      sendJson(res, 500, { error: 'Could not create module' });
    }
  },

  update(req, res) {
    try {
      const data = loadData();
      const index = data.modules.findIndex((m) => m.code_module === req.params.code_module);

      if (index === -1) {
        return sendJson(res, 404, { error: 'Module not found' });
      }

      const updated = { ...data.modules[index], ...req.body, code_module: req.params.code_module };
      data.modules[index] = updated;
      saveData(data);

      sendJson(res, 200, updated);
    } catch (err) {
      console.error(err);
      sendJson(res, 500, { error: 'Could not update module' });
    }
  },
};

export default ModuleController;
