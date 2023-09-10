import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = require('../../src/firebase/serviceAccountKey.json');

@Injectable()
export class FirebaseService {
  connect() {
    const app = initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://scenic-treat-398501.firebaseio.com',
    });
    return app;
  }

  getFirestore() {
    return getFirestore();
  }
}
