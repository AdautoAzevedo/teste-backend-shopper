import { Request, Response } from "express";
import { Measure } from "../models/measures";
import { findByMonth } from "../services/measureService";

enum MeasureType {
    WATER = "Water",
    GAS = "GAS"
}


export class MeasureController {
    public async uploadMeasure(req: Request, res: Response): Promise<void> {
        try {
            const { customer_code, measure_datetime, measure_type, image } = req.body;            
            let upperMeasureType = measure_type.toUpperCase();

            const foundMeasure = await findByMonth(measure_datetime, customer_code, upperMeasureType);
        
            if (foundMeasure.length > 0) {
                res.status(409).json({"error_code": "DOUBLE_REPORT", "error_description": "Leitura do mês já realizada"});
            }
            
            /* verificar se customer já existe no sistema */
            /* API CALL */


        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }


    public async getMeasures(req: Request, res: Response): Promise<void> {
        try {
            const customer_code = req.params.customer_code;
            const measure_type = req.query.measure_type as string;
            const validTypes = Object.values(MeasureType);
                        
            const whereClause: any = {customer_code: customer_code};
            
            if(measure_type) {
                let upperMeasureType = measure_type.toUpperCase() as MeasureType;
                if (!validTypes.includes(upperMeasureType)) {
                    res.status(400).json({
                        "error_code": "INVALID_TYPE",
                        "error_description": "Tipo de medição não permitida"
                       });
                       return;    
                }
                whereClause.measure_type = upperMeasureType;
            }

            
            const measures = await Measure.findAll({
                where: whereClause
            });

            if (measures.length < 1) {
                res.status(404).json({
                    "error_code": "MEASURES_NOT_FOUND",
                    "error_description": "Nenhuma leitura encontrada"
                   })
            }

            const formattedResponse = {
                customer_code: customer_code,
                measures: measures.map(measure => ({
                    measure_uuid: measure.measure_uuid,
                    measure_datetime: measure.measure_datetime,
                    measure_type: measure.measure_type,
                    has_confirmed: measure.has_confirmed,
                    image_url: measure.image_url
                }))
            };

            res.status(200).json(formattedResponse);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }
}