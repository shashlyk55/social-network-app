import { UserReferenceDto } from 'src/users/dto/user-reference.dto';

export class ValidateTokenResponseDto {
  valid: boolean;
  user?: UserReferenceDto;
  message?: string;
}
