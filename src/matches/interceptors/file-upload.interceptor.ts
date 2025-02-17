import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Injectable()
export class FileUploadInterceptor {
  constructor() {}

  getInterceptor() {
    return FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        const hasInvalidFileType = !file.originalname.match(/\.(log|txt)$/i);
        if (hasInvalidFileType) {
          const fileExtension = file.originalname.includes('.')
            ? `.${file.originalname.split('.').pop()}`
            : '';

          return callback(
            new UnsupportedMediaTypeException(
              `Validation failed (current file type is '${fileExtension}', expected are .log or .txt)`,
            ),
            false,
          );
        }

        callback(null, true);
      },
    });
  }
}
