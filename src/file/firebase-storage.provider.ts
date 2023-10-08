/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

@Injectable()
export class FirebaseStorageProvider {
  public async upload(
    file: Express.Multer.File,
    path: string,
    fileName: string,
  ) {
    const storage = getStorage();

    const fileExtension = file.originalname.split('.').pop();
    const fileRef = ref(storage, `${path}/${fileName}.${fileExtension}`);

    // Create file metadata including the content type
    const metadata = {
      contentType: file.mimetype,
    };

    // Upload the file in the bucket storage
    const uploaded = await uploadBytesResumable(fileRef, file.buffer, metadata);

    // Grab the public url
    const downloadURL = await getDownloadURL(uploaded.ref);

    return downloadURL;
  }
}
