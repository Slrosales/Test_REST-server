import express from 'express';
import bodyParser from 'body-parser';
import ModuleController from './controllers/ModuleController.js';
import ProfController from './controllers/ProfController.js';
import StudentController from './controllers/StudentController.js';
import MainController from './controllers/MainController.js';

const app = express();
const port = 3000;
const jsonParser = bodyParser.json();

app.get('/', MainController.getMain);

app.get('/students', StudentController.getAll)
app.get('/students/:ine', StudentController.getOne)
app.post('/students', jsonParser, StudentController.create)
app.put('/students/:ine', jsonParser, StudentController.update)

app.get('/profs', ProfController.getAll)
app.get('/profs/:number', ProfController.getOne)
app.post('/profs', jsonParser, ProfController.create)
app.put('/profs/:number', jsonParser, ProfController.update)

app.get('/modules', ModuleController.getAll)
app.post('/modules', jsonParser, ModuleController.create)
app.put('/modules/:code_module', jsonParser, ModuleController.update)

app.use((req, res) => res.status(404).json({ error: 'Not Found'}));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
