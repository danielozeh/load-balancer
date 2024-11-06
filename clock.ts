import cron from 'node-cron'
import TransactionService from './src/services/transaction';

const transactionService = new TransactionService()

const initializeConJobs = () => {
	// periodic health check for switches (every 10 minutes)
	cron.schedule('*/10 * * * *', transactionService.periodicHealthCheck)
}

initializeConJobs();