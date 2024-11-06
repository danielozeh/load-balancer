import Joi from "joi"

export default {
    processTransaction: Joi.object({
        amount: Joi.number().required(),
        description: Joi.string().required(),
        type: Joi.string().required(),
    })
}
