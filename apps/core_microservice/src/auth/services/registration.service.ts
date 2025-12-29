import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { Repository, DataSource } from 'typeorm';
import { AuthService } from '../auth.service';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly dataSource: DataSource,
  ) {}

  async signup(registerDto: any, profileDto: any) {
    // 1. Предварительная проверка (Pre-check)
    const existingProfile = await this.profileRepository.findOne({
      where: { username: profileDto.username },
    });
    if (existingProfile) {
      throw new ConflictException('Username is already taken');
    }

    let createdUserId: number | null = null;

    try {
      // 2. Регистрация в Auth микросервисе
      const authResult = await this.authService.handleSignUp(registerDto);
      createdUserId = authResult.user.id;

      // 3. Создание профиля в Core микросервисе
      const profile = this.profileRepository.create({
        ...profileDto,
        userId: createdUserId,
        createdById: createdUserId,
      });

      const savedProfile = await this.profileRepository.save(profile);

      return {
        ...authResult,
        profile: savedProfile,
      };
    } catch (error) {
      // 4. КОМПЕНСАЦИЯ (Откат)
      if (createdUserId) {
        await this.authService.rollbackRegistration(createdUserId);
      }

      // Пробрасываем ошибку для контроллера
      throw error;
    }
  }
}
