import { FullAuthResponseDto } from '../dto/full-auth-response.dto';
import { SignUpParams } from '../types/auth-params.types';

export interface IRegistrationService {
  signup(params: SignUpParams): Promise<FullAuthResponseDto>;
}
