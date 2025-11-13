import { ApiProperty } from '@nestjs/swagger';

export class ArchivePostDto {
  @ApiProperty({
    description: 'Whether to archive or unarchive the post',
    example: true,
  })
  archive: boolean;
}
