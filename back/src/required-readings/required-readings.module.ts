import { Module } from '@nestjs/common';
import { RequiredReadingsService } from './required-readings.service';
import { RequiredReadingsController } from './required-readings.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RequiredReadingsController],
  providers: [RequiredReadingsService],
  exports: [RequiredReadingsService],
})
export class RequiredReadingsModule {}
