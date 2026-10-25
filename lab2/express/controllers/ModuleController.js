import { loadData, saveData } from "../data.js";

const ModuleController = {
  getAll(req, res) {
    try {
      const data = loadData();

      res.status(200).json({
        _links: { self: { href: "/modules" } },
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
      res.status(500).json({ error: "Could not read module data" });
    }
  },

  create(req, res) {
    try {
      const module = req.body;

      if (!module || !module.code_module) {
        return res.status(400).json({ error: "code_module is required" });
      }

      const data = loadData();

      if (data.modules.some((m) => m.code_module === module.code_module)) {
        return res.status(409).json({ error: "Module already exists" });
      }

      data.modules.push(module);
      saveData(data);

      res.status(201).json(module);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not create module" });
    }
  },

  update(req, res) {
    try {
      const data = loadData();
      const index = data.modules.findIndex((m) => m.code_module === req.params.code_module);

      if (index === -1) {
        return res.status(404).json({ error: "Module not found" });
      }

      const updated = { ...data.modules[index], ...req.body, code_module: req.params.code_module };
      data.modules[index] = updated;
      saveData(data);

      res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not update module" });
    }
  },
};

export default ModuleController;
