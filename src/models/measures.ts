import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Customer } from "./customer";

@Table({
    tableName: 'measures',
})
export class Measure extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    measure_uuid!: string;

    @Column(DataType.DATE)
    measure_datetime!: Date;

    @Column(DataType.STRING)
    measure_type!: string;

    @Column(DataType.BOOLEAN)
    has_confirmed!: boolean;

    @Column(DataType.STRING)
    image_url!: string

    @Column(DataType.INTEGER)
    measure_value!: number;

    @ForeignKey(() => Customer)
    @Column(DataType.STRING)
    customer_code!: string;

    @BelongsTo(() => Customer)
    customer!: Customer;

}
