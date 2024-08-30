import { Op } from "sequelize";
import { Measure } from "../models/measures";

export async function findByMonth(inputDate:Date, customer_code: string, measure_type: string) {
    const [year, month] = [inputDate.getFullYear(), inputDate.getMonth()+1];
    const startDate = new Date(year, month-1, 1);
    const endDate = new Date(year, month, 0);

    const foundMeasure = await Measure.findAll({
        where: {
            customer_code: customer_code,
            measure_type: measure_type,
            measure_datetime: {
                [Op.between]: [startDate, endDate],
            },
        },
    });
    return foundMeasure;
}