import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { SigninUserInput } from 'src/auth/dto/singin-user.input';
import { SignupResponse } from 'src/auth/dto/signup-response.dto';
import { SignupUserInput } from 'src/auth/dto/signup-user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserInput: CreateUserInput): Promise<User> {
    const newUser = this.userRepository.create(createUserInput);
    return this.userRepository.save(newUser);
  }

  async createUser(createUserInput: SignupUserInput): Promise<SignupResponse> {
    const user = this.userRepository.create(createUserInput);
    try {
      const savedUser = await this.userRepository.save(user);
      // Возвращаем только нужные поля без пароля
      return {
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        phone: savedUser.phone,
        companyName: savedUser.companyName,
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        companyName: true,
        status: true,
        role: true,
      },
    })
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        companyName: true,
        status: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User does not exist!');
    } else {
      return user;
    }
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    return await this.userRepository.save({ id, ...updateUserInput });
  }

  async remove(id: number) {
    const userExists = await this.findOne(id);

    if (!userExists) {
      throw new NotFoundException('User does not exist!');
    } else {
      const user = await this.userRepository.softDelete(id);
      return user;
    }
  }

  async getUser(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User ${email} not found.`);
    }
    return user;
  }
}
