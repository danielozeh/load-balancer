import { Request, Response } from 'express';
import TransactionController from '../controllers/transaction';
import TransactionService from '../services/transaction';
import ResponseHandler from '../utils/response';

// Mock dependencies
jest.mock('../services/transaction');
jest.mock('../utils/response');

describe('TransactionController.processTransaction', () => {
    let req: Request;
    let res: Response;
  
    beforeEach(() => {
      req = { body: { amount: 100, description: 'purchase', type: 'debit' } } as Request;
      res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
  
      // Reset mocks for each test case to ensure isolation
      (TransactionService.prototype.processTransaction as jest.Mock).mockReset();
      (ResponseHandler.sendSuccess as jest.Mock).mockReset();
      (ResponseHandler.sendError as jest.Mock).mockReset();
    });
  
    it('should process transaction successfully', async () => {
      // Mock successful transaction processing
      (TransactionService.prototype.processTransaction as jest.Mock).mockResolvedValue({
        status: true,
        message: 'Transaction processed successfully',
      });
  
      await TransactionController.processTransaction(req as Request, res as Response);
  
      expect(TransactionService.prototype.processTransaction).toHaveBeenCalledWith(req.body);
      expect(ResponseHandler.sendSuccess).toHaveBeenCalledWith(res, {
        status: true,
        message: 'Transaction processed successfully',
      });
    });
  
    it('should return an error when no healthy switch is available', async () => {
      // Mock failure due to no healthy switch
      (TransactionService.prototype.processTransaction as jest.Mock).mockResolvedValue({
        status: false,
        message: 'No healthy switch found',
      });
  
      await TransactionController.processTransaction(req as Request, res as Response);
  
      expect(TransactionService.prototype.processTransaction).toHaveBeenCalledWith(req.body);
      expect(ResponseHandler.sendError).toHaveBeenCalledWith(res, {
        status: false,
        message: 'No healthy switch found',
      });
    });
  
    it('should handle transaction processing failure', async () => {
      // Mock failed transaction processing
      (TransactionService.prototype.processTransaction as jest.Mock).mockResolvedValue({
        status: false,
        message: 'Transaction processing failed',
        error: 'An error occurred',
        status_code: 500,
      });
  
      await TransactionController.processTransaction(req as Request, res as Response);
  
      expect(TransactionService.prototype.processTransaction).toHaveBeenCalledWith(req.body);
      expect(ResponseHandler.sendError).toHaveBeenCalledWith(res, {
        status: false,
        message: 'Transaction processing failed',
        error: 'An error occurred',
        status_code: 500,
      });
    });
});
