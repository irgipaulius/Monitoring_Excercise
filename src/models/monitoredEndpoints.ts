import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn
} from "typeorm";
import { User } from "./user";

@Entity()
export class MonitoredEndpoints {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "text" })
  public name: string;

  @Column({ type: "text" })
  public url: string;

  @Column({ type: "date" })
  public created: Date;

  @Column({ type: "date" })
  public checked: Date;

  @Column({ type: "int" })
  public monitorInterval: number;

  @Column({ type: "int" })
  public ownerId: number;
}
