import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  ParseUUIDPipe,
  Redirect,
  Query,
  Req,
} from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { FirebaseService } from 'src/firebase/firebase.service';

@Controller('candidates')
export class CandidatesController {
  constructor(
    private readonly candidatesService: CandidatesService,
    private firebase: FirebaseService,
  ) {
    this.firebase.connect();
  }

  @Post()
  create(@Body() createCandidateDto: CreateCandidateDto) {
    const db = this.firebase.getFirestore();
    return this.candidatesService.create(createCandidateDto, db);
  }

  @Get()
  async findAll() {
    const db = this.firebase.getFirestore();
    return this.candidatesService.findAll(db);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.candidatesService.findOne(+id);
  }

  @Get('uuid/:uuid')
  findOneByUuid(
    @Param(
      'uuid',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    uuid: string,
  ) {
    return 'uuid: ' + uuid;
  }

  @Get('docs/:version')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Param('version') version: string) {
    return { url: 'https://docs.nestjs.com/v' + version };
  }

  @Patch(':id')
  update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() updateCandidateDto: UpdateCandidateDto,
  ) {
    return this.candidatesService.update(+id, updateCandidateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.candidatesService.remove(+id);
  }
}
