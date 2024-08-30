import { Op } from "sequelize";
import { Measure } from "../models/measures";

export async function findByMonth(inputDate:Date, customer_code: string, measure_type: string) {
   const year = inputDate.getFullYear();
   const month = inputDate.getMonth() + 1;
    const startDate = new Date(year, month-1, 1);
    const endDate = new Date(year, month, 0);

    try {
        return await Measure.findAll({
            where: {
                customer_code,
                measure_type,
                measure_datetime: {
                    [Op.between]: [startDate, endDate],
                },
            },
        });
    } catch (error) {
        console.error("Error finding measures by month");
        throw error;
    }
}