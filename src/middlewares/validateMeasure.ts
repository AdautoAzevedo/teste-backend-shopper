import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateMeasure = [
   
    body('customer_code')
        .isString().withMessage('Customer code must be a String'),
    body('measure_datetime')
        .isISO8601().withMessage('Data não está no formato esperado'),
    body('measure_type')
        .matches(/^(water|gas)$/i).withMessage('Tipo deve ser WATER ou GAS'),
    body('image')
        .matches(/^data:image\/(png|jpg|jpeg|gif);base64,[a-zA-Z0-9+/=]+$/)
        .withMessage('Imagem deve estar em base64'),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                "error_code": "INVALID_DATA",
                "error_description":errors.array()[0].msg
                })
        }
        next();
    }
]
