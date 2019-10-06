import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MonitoringResult {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "date" })
  public checked: Date;

  @Column({ type: "int" })
  public statusCode: number;

  @Column({ type: "json" })
  public payload: string;

  @Column({ type: "int" })
  public endpointID: number;
}
