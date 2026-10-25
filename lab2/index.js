import { Router, createServer } from 'tiny-router';
import MainController from './controllers/MainController.js';
import StudentController from './controllers/StudentController.js';
import ProfController from './controllers/ProfController.js';
import ModuleController from './controllers/ModuleController.js';

const port = 8080;
const router = new Router();

router.get('/', MainController.getMain);

router.get('/students', StudentController.getAll);
router.get('/students/:ine', StudentController.getOne);
router.post('/students', StudentController.create);
router.put('/students/:ine', StudentController.update);

router.get('/profs', ProfController.getAll);
router.get('/profs/:number', ProfController.getOne);
router.post('/profs', ProfController.create);
router.put('/profs/:number', ProfController.update);

router.get('/modules', ModuleController.getAll);
router.get('/modules/:code_module', ModuleController.getOne);
router.post('/modules', ModuleController.create);
router.put('/modules/:code_module', ModuleController.update);

createServer(router, port);
