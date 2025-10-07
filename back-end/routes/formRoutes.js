import {
    addForm,
    getForms,
    dataSummary,
} from '../controllers/formController.js'

const formRoutes = express.Router();

formRoutes.post("./Form", addForm);
formRoutes.get("/getData", getForms);
formRoutes.get("/summary", dataSummary);

export default formRoutes;