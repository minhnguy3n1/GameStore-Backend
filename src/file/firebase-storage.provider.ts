/* eslint-disable prettier/prettier */
import { HttpCode, Injectable, NotFoundException } from '@nestjs/common';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject,
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

  public async delete(fileURL) {
    const storage = getStorage();

    const fileRef = ref(storage, fileURL)
    return deleteObject(fileRef)
      .then(() => {
        return HttpCode(200);
      })
      .catch(() => {
        throw new NotFoundException('Cannot found fileUrl');
      });
  }
}

