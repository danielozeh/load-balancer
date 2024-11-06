import config from '../config';

class ResponseHandler {
    static render(res: any, content_type: string, filename: string, data: any) {
        res.header('Content-Type', content_type);
        res.header('Content-Disposition', `inline; filename="${filename}"`);
        return res.send(data);     
    }    
    static response(res: any, message: any, status_code: number, status: boolean, data: any) {
        return res.status(status_code).send({
            status, message, data
        }).end()
    }
    static internalServerError(res: any, message  = `An unknown error occurred while executing request. If this issue persists, please contact a member of support at ${config.support_email}`, data = []) {
        return this.response(res, message, 500, false, data)
    }
    static sendError(res: any, {message = '', status_code = 400, data = null}) {
        return this.response(res, message, status_code, false, data)
    }
    static renderSuccess(res: any, {content_type = '', filename = "", data = null}) {
        return this.render(res, content_type, filename, data)
    }
    static sendSuccess(res: any, {message = "", status_code = 200, data = null}) {
        return this.response(res, message, status_code, true, data)
    }

    static standardResponse(status: boolean, message: string, data: any = null) {
        return {status, message, data}
    }
}

export default ResponseHandler