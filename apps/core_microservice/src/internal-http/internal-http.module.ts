import { Module } from '@nestjs/common';
import { InternalHttpService } from './internal-http.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [InternalHttpService],
  exports: [InternalHttpService],
})
export class InternalHttpModule {}
