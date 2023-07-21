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

  //ParseIntPipe convert param sang number
  @Get('/:id')
  getNoteById(@Param('id', ParseIntPipe) uid: number) {
    return this.noteService.getNoteById(uid);
  }

  @Post('/create-note')
  insertNote(@GetUser('id') uid: number, @Body() body: InsertNoteDTO) {
    return this.noteService.insertNote(uid, body);
  }

  @Patch('/update-note/:id')
  updateNoteById(
    @Param('id', ParseIntPipe) nid: number,
    @Body() body: UpdateNoteDTO,
  ) {
    return this.noteService.updateNoteById(nid, body);
  }

  @Delete('/delete-note/:id')
  deleteNoteById(@Param('id', ParseIntPipe) nid: number) {
    return this.noteService.deleteNoteById(nid);
  }
}
