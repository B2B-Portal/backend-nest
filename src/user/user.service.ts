import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignupResponse } from 'src/auth/dto/signup-response.dto';
import { SignupUserInput } from 'src/auth/dto/signup-user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(
      createUserDto as DeepPartial<User>,
    );
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
    return this.userRepository.find({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        companyName: true,
        address: true,
        city: true,
        status: true,
        role: true,
      },
    });
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
        address: true,
        city: true,
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

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!existingUser) {
      throw new NotFoundException('User does not exist!');
    }

    return this.userRepository.save(existingUser);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.userRepository.softDelete(id);
  }

  async getUser(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User ${email} not found.`);
    }
    return user;
  }
}
