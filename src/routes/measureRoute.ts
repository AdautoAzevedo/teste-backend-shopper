import { Router } from "express";
import { MeasureController } from "../controllers/measureController";
import { validateMeasure } from "../middlewares/validateMeasure";
import { ConfirmController } from "../controllers/confirmController";
import { validateConfirm } from "../middlewares/validateConfirmValues";

const router = Router();
const measureController = new MeasureController();
const confirmController = new ConfirmController();

router.post('/upload', validateMeasure, measureController.uploadMeasure);
router.get('/:customer_code/list', measureController.getMeasures);
router.patch('/confirm',validateConfirm, confirmController.confirmValue);

export default router;