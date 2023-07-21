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

    return notes;
  }

  async getNoteById(uid: number) {
    const note = await this.prismaService.note.findFirst({
      where: { id: uid },
    });

    return note;
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

    await this.prismaService.note.update({
      where: { id: nid },
      data: { ...body },
    });

    return { mess: 'UPDATE SUCCESSFULLY' };
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

    await this.prismaService.note.delete({
      where: {
        id: nid,
      },
    });

    return { mess: 'DELETE SUCCESSFULLY' };
  }
}
