import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; 
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
   async create(createUserDto: CreateUserDto) {
    const slatRounds = 10;
    const hashPassword = await bcrypt.hash(createUserDto.password, slatRounds);
    const newUser = this.userRepository.create({...createUserDto, password: hashPassword});

    return await this.userRepository.save(newUser);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const slatRounds = 10;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, slatRounds);
    }
    
    await this.userRepository.update(id, updateUserDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }

//  async findByEmail(email: string): Promise<User | null> {
//    return await this.userRepository.findOne({ where: { email } });
//  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
