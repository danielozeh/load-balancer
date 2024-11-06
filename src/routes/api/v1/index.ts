import express from "express"

const router = express.Router()

import transactionRouter from './transaction'

router.use('/transaction', transactionRouter)

export default router