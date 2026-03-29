import { randomUUID } from 'crypto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class MediaService {
  constructor(private readonly configService: ConfigService) {}

  async uploadFile(
    file: Express.Multer.File,
    folder?: string,
    bucketOverride?: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const bucket = bucketOverride?.trim() || this.configService.get<string>('S3_BUCKET');
    const endpoint = this.configService.get<string>('S3_ENDPOINT');
    const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY');
    const secretAccessKey = this.configService.get<string>('S3_SECRET_KEY');
    const region = this.configService.get<string>('S3_REGION') ?? 'us-east-1';
    const forcePathStyle =
      this.configService.get<string>('S3_FORCE_PATH_STYLE') !== 'false';

    if (!bucket || !endpoint || !accessKeyId || !secretAccessKey) {
      throw new BadRequestException(
        'S3 config is not set. Please define S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY and S3_BUCKET or send bucket in request',
      );
    }

    const s3Client = new S3Client({
      endpoint,
      region,
      forcePathStyle,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const key = this.buildObjectKey(folder, file.originalname);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      key,
      bucket,
      url: this.buildPublicUrl(bucket, key, endpoint, forcePathStyle),
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  resolvePublicUrl(
    fileUrlOrKey: string | null | undefined,
    bucketOverride?: string,
  ) {
    if (!fileUrlOrKey) {
      return null;
    }

    if (/^https?:\/\//i.test(fileUrlOrKey)) {
      return fileUrlOrKey;
    }

    const bucket = bucketOverride?.trim() || this.configService.get<string>('S3_BUCKET');
    const endpoint = this.configService.get<string>('S3_ENDPOINT');
    const forcePathStyle =
      this.configService.get<string>('S3_FORCE_PATH_STYLE') !== 'false';

    if (!bucket || !endpoint) {
      return fileUrlOrKey;
    }

    const normalizedValue = fileUrlOrKey.replace(/^\/+/, '');
    const key = normalizedValue.startsWith(`${bucket}/`)
      ? normalizedValue.slice(bucket.length + 1)
      : normalizedValue;

    return this.buildPublicUrl(bucket, key, endpoint, forcePathStyle);
  }

  private buildObjectKey(folder: string | undefined, originalName: string) {
    const safeName = originalName.replace(/[^\w.-]/g, '_');
    const objectName = `${Date.now()}-${randomUUID()}-${safeName}`;
    const normalizedFolder = folder?.trim().replace(/^\/+|\/+$/g, '');
    return normalizedFolder ? `${normalizedFolder}/${objectName}` : objectName;
  }

  private buildPublicUrl(
    bucket: string,
    key: string,
    endpoint: string,
    forcePathStyle: boolean,
  ) {
    const customPublicUrl = this.configService.get<string>('S3_PUBLIC_URL');
    if (customPublicUrl) {
      const normalizedCustomUrl = customPublicUrl.replace(/\/$/, '');
      if (normalizedCustomUrl.includes('{bucket}')) {
        return `${normalizedCustomUrl.replace('{bucket}', bucket)}/${key}`;
      }
      return `${normalizedCustomUrl}/${bucket}/${key}`;
    }

    const normalizedEndpoint = endpoint.replace(/\/$/, '');
    if (forcePathStyle) {
      return `${normalizedEndpoint}/${bucket}/${key}`;
    }

    try {
      const parsed = new URL(normalizedEndpoint);
      return `${parsed.protocol}//${bucket}.${parsed.host}/${key}`;
    } catch {
      return `${normalizedEndpoint}/${bucket}/${key}`;
    }
  }
}
