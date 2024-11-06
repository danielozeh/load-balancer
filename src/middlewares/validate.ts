import Response from '../utils/response'

const validate =  (joi: any, body = 'body') => {
    return async (req: any, res: any, next: any) => {
        try {
            const {error} = await joi.validateAsync(req[body], {abortEarly: false, allowUnknown: true})
            const valid = error == null
            if (valid) {
                next()
            } else {
                // const {details} = error
                const details: any = error.details
                const message = details.map((i: any) => i.message && i.message.replace(/['"]/g, '').replace(/mongo/g, '')).join(' and ')

                return Response.sendError(res, {message, status_code: 400})
            }
        }catch (e: any) {
            const {details} = e
            const message = (details) ? details.map((i: any) => i.message && i.message.replace(/['"]/g, '').replace(/mongo/g, '')).join(' and ') : ((e.message) ? e.message : "An error occurred");
            return Response.sendError(res, {
                message,
                status_code: 400
            })
        }
    }
}

export default validate
