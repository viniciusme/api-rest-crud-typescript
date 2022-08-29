import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import {
  IsEmail,
  IsNotEmpty,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import * as bcrypt from "bcryptjs";

@Entity()
@Unique(["username"])
export class users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: "O nome não deve estar vazio." })
  @MaxLength(100, { message: "O nome deve ter no máximo 100 caracteres." })
  @MinLength(3, { message: "O nome deve ter pelo menos 3 caracteres." })
  first_name: string;

  @Column()
  @IsNotEmpty({ message: "O sobrenome não deve estar vazio." })
  @MaxLength(100, { message: "O sobrenome deve ter no máximo 100 caracteres." })
  @MinLength(3, { message: "O sobrenome deve ter pelo menos 3 caracteres." })
  last_name: string;

  @Column()
  @IsNotEmpty({ message: "Username não deve estar vazio." })
  @MaxLength(20, {
    message: "O nome de usuário deve ter pelo menos 20 caracteres.",
  })
  @MinLength(5, {
    message: "O nome de usuário deve ter no mínimo 5 caracteres.",
  })
  username: string;

  @Column()
  @IsNotEmpty({ message: "E-mail não deve estar vazio." })
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  @MaxLength(100, { message: "A senha deve ter no máximo 100 caracteres." })
  @MinLength(8, { message: "A senha deve ter no mínimo 8 caracteres." })
  password: string;

  @Column()
  @IsNotEmpty({ message: "Roles não deve estar vazio." })
  @MaxLength(20, { message: "Role deve ter pelo menos 30 caracteres." })
  @MinLength(3, { message: "Role deve ter no  mínimo 3 caracteres." })
  role: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
