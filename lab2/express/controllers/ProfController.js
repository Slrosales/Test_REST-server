import { loadData, saveData } from "../data.js";

const ProfController = {
  getAll(req, res) {
    try {
      const data = loadData();

      res.status(200).json({
        _links: { self: { href: "/profs" } },
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
      res.status(500).json({ error: "Could not read profs data" });
    }
  },

  getOne(req, res) {
    try {
      const data = loadData();
      const prof = data.profs.find((p) => p.number === req.params.number);

      if (!prof) {
        return res.status(404).json({ error: "prof not found" });
      }

      res.status(200).json(prof);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not read prof data" });
    }
  },

  create(req, res) {
    try {
      const prof = req.body;

      if (!prof || !prof.number) {
        return res.status(400).json({ error: "number is required" });
      }

      const data = loadData();

      if (data.profs.some((p) => p.number === prof.number)) {
        return res.status(409).json({ error: "Prof already exists" });
      }

      data.profs.push(prof);
      saveData(data);

      res.status(201).json(prof);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not create prof" });
    }
  },

  update(req, res) {
    try {
      const data = loadData();
      const index = data.profs.findIndex((p) => p.number === req.params.number);

      if (index === -1) {
        return res.status(404).json({ error: "Prof not found" });
      }

      const updated = { ...data.profs[index], ...req.body, number: req.params.number };
      data.profs[index] = updated;
      saveData(data);

      res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not update prof" });
    }
  },
};
export default ProfController;
