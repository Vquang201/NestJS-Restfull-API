import {
  Controller,
  Get,
  Post,
  Patch,
  UseGuards,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { MyJWTGuard } from 'src/auth/guard';
import { NoteService } from './note.service';
import { GetUser } from 'src/auth/decorators';
import { InsertNoteDTO, UpdateNoteDTO } from './dto';

// phải có access token
@UseGuards(MyJWTGuard)
@Controller('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}
  @Get()
  getNotes(@GetUser('id') uid: number) {
    return this.noteService.getNotes(uid);
  }

  @Get(':id')
  getNoteById(@Param('id') uid: number) {
    return this.noteService.getNoteById(uid);
  }

  @Post()
  insertNote(@GetUser('id') uid: number, @Body() body: InsertNoteDTO) {
    return this.noteService.insertNote(uid, body);
  }

  @Patch()
  updateNoteById(
    @Param('id', ParseIntPipe) nid: number,
    @Body() body: UpdateNoteDTO,
  ) {
    return this.noteService.updateNoteById(nid, body);
  }

  @Delete('')
  deleteNoteById(@Param('id', ParseIntPipe) nid: number) {
    return this.noteService.deleteNoteById(nid);
  }
}
