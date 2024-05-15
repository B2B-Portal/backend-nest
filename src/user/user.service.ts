import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { SigninUserInput } from 'src/auth/dto/singin-user.input';
import { SignupResponse } from 'src/auth/dto/signup-response';

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

  async createUser(createUserInput: SigninUserInput): Promise<SignupResponse> {
    const user = this.userRepository.create(createUserInput);
    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      }
    });

    if (!user) {
      throw new NotFoundException('User does not exist!');
    } else {
      return user;
    }
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    return await this.userRepository.save({ id, ...updateUserInput })
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
    console.log(email)
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User ${email} not found.`);
    }
    return user;
  }
}
