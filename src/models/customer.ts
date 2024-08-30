import { Table, Column, Model, HasMany, PrimaryKey, DataType } from "sequelize-typescript";
import { Measure } from "./measures";

@Table({
    tableName: 'customers'
})
export class Customer extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    customer_code!: string;

    @HasMany(() => Measure)
    measures!: Measure[];
}