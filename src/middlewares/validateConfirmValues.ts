import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateConfirm = [
    body('measure_uuid')
        .isString().withMessage('Measure uuid must be a String'),
    body('confirmed_value')
        .isNumeric().withMessage('Value must be a valid number'),
    
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