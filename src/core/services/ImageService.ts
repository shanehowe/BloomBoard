import { BlobServiceClient } from "@azure/storage-blob";

export class ImageService {
  private readonly blobServiceClient: BlobServiceClient;

  constructor(connectionString: string) {
    this.blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
  }

  async uploadImage(file: File) {
    const imageContainerName = "images";
    const containerClient =
      this.blobServiceClient.getContainerClient(imageContainerName);
    const blockBlobClient = containerClient.getBlockBlobClient(file.name);
    const fileBuffer = await file.arrayBuffer();
    await blockBlobClient.uploadData(fileBuffer);
    return blockBlobClient.url;
  }
}
