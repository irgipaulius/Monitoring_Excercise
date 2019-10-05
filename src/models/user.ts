import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public userName: string;

  @Column()
  public email: string;

  @Column()
  public accessToken: string;
}
