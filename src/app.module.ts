import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CandidatesModule } from './candidates/candidates.module';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [CandidatesModule, ConfigModule.forRoot(), FirebaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
