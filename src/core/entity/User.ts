import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class users {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  role: string;

  /*@Column()
  created_at: Date;

  @Column()
  updated_at: Date;*/
}
