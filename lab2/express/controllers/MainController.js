import { loadData } from '../data.js';

const MainController = {
  getMain(req, res) {
    try {
      const data = loadData();

      const head = data.responsibles.map((number) => {
        const prof = data.profs.find((p) => p.number === number);
        return { name: `${prof.lastname} ${prof.firstname[0]}.`, href: `/profs/${number}` };
      });

      res.status(200).json({
        name: data.name,
        _links: {
          students: { href: '/students' },
          profs: { href: '/profs' },
          modules: { href: '/modules' },
          head,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'data.json not found or invalid' });
    }
  },
};

export default MainController;
