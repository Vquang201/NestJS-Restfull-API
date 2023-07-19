import { ForbiddenException, Injectable } from '@nestjs/common';
import { InsertNoteDTO, UpdateNoteDTO } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NoteService {
  constructor(private prismaService: PrismaService) {}

  async getNotes(uid: number) {
    const notes = await this.prismaService.note.findMany({
      where: { userId: uid },
    });
  }

  async getNoteById(uid: number) {
    const note = await this.prismaService.note.findUnique({
      where: { id: uid },
    });
  }

  async insertNote(uid: number, body: InsertNoteDTO) {
    const note = await this.prismaService.note.create({
      data: {
        ...body,
        userId: uid,
      },
    });

    return note;
  }

  async updateNoteById(nid: number, body: UpdateNoteDTO) {
    const note = await this.prismaService.note.findUnique({
      where: {
        id: nid,
      },
    });

    if (!note) {
      throw new ForbiddenException('Cannot find Note to delete');
    }

    return await this.prismaService.note.update({
      where: { id: nid },
      data: { ...body },
    });
  }

  async deleteNoteById(nid: number) {
    const note = await this.prismaService.note.findUnique({
      where: {
        id: nid,
      },
    });

    if (!note) {
      throw new ForbiddenException('Cannot find Note to delete');
    }

    return await this.prismaService.note.delete({
      where: {
        id: nid,
      },
    });
  }
}
