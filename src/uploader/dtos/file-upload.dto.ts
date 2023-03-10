/*
  Free and Open Source - MIT
  Copyright © 2023
  Afonso Barracha
*/

import { IsMimeType, IsString } from 'class-validator';
import { ReadStream } from 'fs-capacitor';
import { FileUpload } from 'graphql-upload/Upload';

export abstract class FileUploadDto implements FileUpload {
  @IsString()
  public filename!: string;

  @IsString()
  @IsMimeType()
  public mimetype!: string;

  @IsString()
  public encoding!: string;

  public createReadStream!: () => ReadStream;
}
