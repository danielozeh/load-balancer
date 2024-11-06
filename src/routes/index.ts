import express, {Request, Response} from "express"
import ResponseHandler from "../utils/response"

const router = express.Router()

router.get('/', (req: Request, res: Response) => {
    return ResponseHandler.sendSuccess(res, {message: 'Welcome to Load Balancing Service'})
})

router.get('/health', (req: Request, res: Response) => {
    return ResponseHandler.sendSuccess(res, {message: 'Load Balancing Service is healthy'})
})

router.get('/v1', (req: Request, res: Response) => {
    return ResponseHandler.sendSuccess(res, {message: 'Welcome to Load Balancing Service v1.0'})
})

//group v1 routes
import version1Routes from './api/v1'

router.use('/v1', version1Routes)

export default router