// src/users/dto/user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

class UserReferenceDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'admin', description: 'User role' })
  role: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'admin', description: 'User role' })
  role: string;

  @ApiProperty({ example: false, description: 'Whether user is disabled' })
  disabled: boolean;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Update date' })
  updatedAt: Date;

  @ApiProperty({ example: 1, description: 'Creator ID' })
  createdById: number;

  @ApiProperty({ example: 2, description: 'Updater ID', nullable: true })
  updatedById: number | null;

  @ApiProperty({
    type: UserReferenceDto,
    description: 'User who created this record',
    nullable: true,
  })
  createdBy?: UserReferenceDto;

  @ApiProperty({
    type: UserReferenceDto,
    description: 'User who updated this record',
    nullable: true,
  })
  updatedBy?: UserReferenceDto;
}
