import { sendJson } from 'tiny-router';
import { loadData } from '../data.js';

const MainController = {
  getMain(req, res) {
    try {
      const data = loadData();

      const head = data.responsibles.map((number) => {
        const prof = data.profs.find((p) => p.number === number);
        return { name: `${prof.lastname} ${prof.firstname[0]}.`, href: `/profs/${number}` };
      });

      sendJson(res, 200, {
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
      sendJson(res, 500, { error: 'data.json not found or invalid' });
    }
  },
};

export default MainController;
