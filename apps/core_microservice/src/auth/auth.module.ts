import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OrchestratorAuthService } from './services/orchestrator-auth.service';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { InternalHttpModule } from 'src/internal-http/internal-http.module';

@Module({
  imports: [InternalHttpModule, ProfilesModule],
  controllers: [AuthController],
  providers: [AuthService, OrchestratorAuthService],
})
export class AuthModule {}
