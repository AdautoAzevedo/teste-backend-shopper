import { Request, Response } from "express";
import { Measure } from "../models/measures";

export class ConfirmController {
    public async confirmValue(req: Request, res: Response): Promise<void> {
        try {
            const { measure_uuid, confirmed_value } = req.body;

            const foundMeasure = await Measure.findByPk(measure_uuid);
            if (!foundMeasure) {
                res.status(404).json({
                    "error_code": "MEASURE_NOT_FOUND",
                    "error_description": "Leitura não realizada"})
            }

            if (foundMeasure?.has_confirmed) {
                res.status(409).json({
                    "error_code": "CONFIRMATION_DUPLICATE",
                    "error_description": "Leitura do mês já realizada"})
            }

            if (foundMeasure?.measure_value !== confirmed_value) {
                (foundMeasure as Measure).measure_value = confirmed_value;
            }

            (foundMeasure as Measure).has_confirmed = true;
            foundMeasure?.save();
            res.status(200).json({"success": "true"})
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }
}