import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OrchestratorAuthService } from './services/orchestrator-auth.service';
import { InternalHttpService } from './services/internal-http.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, ProfilesModule],
  controllers: [AuthController],
  providers: [AuthService, OrchestratorAuthService, InternalHttpService],
})
export class AuthModule {}
