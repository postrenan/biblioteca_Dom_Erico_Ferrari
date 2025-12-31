import { Controller, Get, Body, Put } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('settings')
export class SettingsController {
    constructor(private prisma: PrismaService) { }

    @Get('label-type')
    async getLabelType() {
        const setting = await this.prisma.systemSetting.findUnique({
            where: { key: 'labelType' }
        });
        return { value: setting?.value || "AUTO" };
    }

    @Put('label-type')
    async setLabelType(@Body() body: { value: string }) {
        const setting = await this.prisma.systemSetting.upsert({
            where: { key: 'labelType' },
            update: { value: body.value },
            create: { key: 'labelType', value: body.value }
        });
        return setting;
    }
}
