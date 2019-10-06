import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "text" })
  public name: string;

  @Column({ type: "text" })
  public email: string;

  @Column({ type: "text" })
  public accessToken: string;
}
