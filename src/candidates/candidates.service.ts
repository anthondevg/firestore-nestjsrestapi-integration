import { Injectable } from '@nestjs/common';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

@Injectable()
export class CandidatesService {
  async create(createCandidateDto: CreateCandidateDto, firestoreDb: any) {
    const res = await firestoreDb
      .collection('candidates')
      .add(createCandidateDto);
    return res;
  }

  async findAll(firestoreDb: any) {
    const candidatesRef = await firestoreDb.collection('candidates').get();
    return candidatesRef.docs.map((doc) => doc.data());
  }

  findOne(id: number) {
    return `This action returns a #${id} candidate`;
  }

  update(id: number, updateCandidateDto: UpdateCandidateDto) {
    return `This action updates a #${id} candidate`;
  }

  remove(id: number) {
    return `This action removes a #${id} candidate`;
  }
}
