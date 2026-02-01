import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { UploadAssetDto } from './dto/upload-asset.dto';
import { AssetMapper } from './utils/params.mapper';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AssetResponseDto } from './dto/asset-response.dto';

@ApiTags('assets')
@ApiBearerAuth('access-token')
@UseGuards(AccessGuard)
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get('download/:assetId')
  async downloadFile(@Param('assetId') id: number) {
    const { stream, originalName } =
      await this.assetsService.getAssetForDownload(id);

    return new StreamableFile(stream, {
      disposition: `attachment; filename="${encodeURIComponent(originalName)}"`,
    });
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload new asset' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        fileType: { type: 'string', example: 'IMAGE' },
        orderIndex: { type: 'number', example: 0 },
      },
    },
  })
  @ApiResponse({ status: 201, type: AssetResponseDto })
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('userId') userId: number,
    @Body() dto: UploadAssetDto,
  ) {
    const params = AssetMapper.toUploadParams(dto);
    const result = await this.assetsService.upload(file, params, userId);

    return {
      id: result.id,
      downloadUrl: result.downloadUrl,
      orderIndex: result.orderIndex,
      fileType: result.fileType,
      fileName: result.fileName,
    };
  }

  @Delete(':assetId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('assetId') assetId: number) {
    await this.assetsService.delete(assetId);
  }
}
