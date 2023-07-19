import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
    });
  }

  cleanDatabase() {
    // mối quan hệ 1 - n , xóa nhiều trước rồi xóa 1
    // transaction 1 trong 2 lệnh bị lỗi thì rollback
    return this.$transaction([this.note.deleteMany(), this.user.deleteMany()]);
  }
}
