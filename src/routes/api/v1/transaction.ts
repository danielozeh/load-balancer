import { Router, Request, Response } from "express";
import TransactionController from "../../../controllers/transaction";
import validate from "../../../middlewares/validate";
import transactionValidation from "../../../validations/transaction";

const router = Router();

router.post('/', validate(transactionValidation.processTransaction), TransactionController.recordTransaction)
router.post('/process', TransactionController.processTransaction)

export default router;