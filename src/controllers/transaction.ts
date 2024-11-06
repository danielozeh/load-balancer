import { Request, Response } from 'express'
import TransactionService from '../services/transaction'
import ResponseHandler from '../utils/response'

const transactionService = new TransactionService()

class TransactionController {
    static async recordTransaction(req: Request, res: Response) {
        const transaction = req.body
        const result = await transactionService.recordTransaction(transaction)
        if (result.status) {
            return ResponseHandler.sendSuccess(res, result)
        } else {
            return ResponseHandler.sendError(res, result)
        }
    }

    static async processTransaction(req: Request, res: Response) {
        const transaction = req.body
        const result = await transactionService.processTransaction(transaction)
        if (result.status) {
            return ResponseHandler.sendSuccess(res, result)
        } else {
            return ResponseHandler.sendError(res, result)
        }
    }
}

export default TransactionController