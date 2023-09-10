import { Module } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  controllers: [CandidatesController],
  providers: [CandidatesService, FirebaseService],
})
export class CandidatesModule {}
