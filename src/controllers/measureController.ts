import { Request, Response } from "express";
import { Measure } from "../models/measures";
import { findByMonth } from "../services/measureService";
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager} from '@google/generative-ai/server'
import { Customer } from "../models/customer";
import {v4 as uuidv4} from 'uuid';
import { uploadImage } from "../services/fileService";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 
const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});


enum MeasureType {
    WATER = "Water",
    GAS = "GAS"
}


export class MeasureController {
    
    public async uploadMeasure(req: Request, res: Response): Promise<void> {
        const { customer_code, measure_datetime, measure_type, image } = req.body;            
        let upperMeasureType = measure_type.toUpperCase();
        const base64Image = image.replace(/^data:image\/\w+;base64,/, '');
        const mimeType = image.match(/data:(.*?);base64/)?.[1];

        try {            
            const foundCustomer = await Customer.findByPk(customer_code);
            if (!foundCustomer) {
                const customer = new Customer(customer_code);
                await customer.save();
            }

            const foundMeasure = await findByMonth(measure_datetime, customer_code, upperMeasureType);
            if (foundMeasure.length > 0) {
                res.status(409).json({"error_code": "DOUBLE_REPORT", "error_description": "Leitura do mês já realizada"});
            }
            
            const sample_file = await uploadImage(base64Image, mimeType);

            const result = await model.generateContent([
                {text: "Qual é o valor da medida que aparece na foto? Por favor me mande na resposta apenas o valor como um inteiro"},
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: base64Image
                    }
                }
            ]);


            const newMeasure = await Measure.create({
                measure_uuid: uuidv4(),
                measure_datetime: new Date(measure_datetime),
                measure_type: upperMeasureType,
                has_confirmed: false,
                image_url: sample_file.file.uri,
                measure_value: parseInt(result.response.text(), 10),
                customer_code: customer_code
            });

            res.status(200).json({
                "image_url": newMeasure.image_url,
                "measure_value": newMeasure.measure_value,
                "measure_uuid": newMeasure.measure_uuid
            });

        } catch (error) {            
            console.log(error);   
            res.status(500).json(error);
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
