// Load .env file in Node.js environments (for scripts)
if (typeof window === 'undefined') {
  try {
    require('dotenv').config();
  } catch (e) {
    // dotenv not available or already loaded, that's ok
  }
}

import { PinataSDK } from "pinata";

// Get gateway - works in both browser and Node.js
const getGateway = () => {
  // In browser (Next.js), use NEXT_PUBLIC_ prefix
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud";
  }
  // In Node.js (scripts), use regular env var
  return process.env.PINATA_GATEWAY || process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud";
};

// Initialize Pinata SDK
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: getGateway(),
});

export interface UploadResult {
  success: boolean;
  cid?: string;
  ipfsUrl?: string;
  error?: string;
}

/**
 * Upload JSON data to IPFS via Pinata
 */
export async function uploadJSON(
  data: object,
  name: string
): Promise<UploadResult> {
  try {
    console.log(`📤 Uploading JSON to IPFS: ${name}`);

    // Use Pinata SDK v2 API: upload.public.json()
    const result = await pinata.upload.public.json(data);

    const cid = result.cid;
    const ipfsUrl = `ipfs://${cid}`;

    console.log(`✅ JSON uploaded successfully: ${ipfsUrl}`);

    return {
      success: true,
      cid,
      ipfsUrl,
    };
  } catch (error) {
    console.error("❌ Error uploading JSON to IPFS:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Upload file (Buffer or Blob) to IPFS via Pinata
 */
export async function uploadFile(
  file: File | Blob,
  name: string
): Promise<UploadResult> {
  try {
    console.log(`📤 Uploading file to IPFS: ${name}`);

    // Convert Blob to File if needed
    const fileToUpload = file instanceof File
      ? file
      : new File([file], name, { type: file.type || 'image/svg+xml' });

    // Use Pinata SDK v2 API: upload.public.file()
    const upload = await pinata.upload.public.file(fileToUpload);

    const cid = upload.cid;
    const ipfsUrl = `ipfs://${cid}`;

    console.log(`✅ File uploaded successfully: ${ipfsUrl}`);

    return {
      success: true,
      cid,
      ipfsUrl,
    };
  } catch (error) {
    console.error("❌ Error uploading file to IPFS:", error);
    console.error("Error details:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Upload multiple files as a folder to IPFS via Pinata
 */
export async function uploadFolder(
  files: { name: string; content: string | Blob }[]
): Promise<UploadResult> {
  try {
    console.log(`📁 Uploading folder with ${files.length} files to IPFS...`);

    // Convert to File array
    const fileArray = files.map((file) => {
      const blob =
        typeof file.content === "string"
          ? new Blob([file.content], { type: "application/json" })
          : file.content;

      return new File([blob], file.name, {
        type: typeof file.content === "string" ? "application/json" : "image/svg+xml",
      });
    });

    // Use Pinata SDK v2 API: upload.public.fileArray() for multiple files
    const upload = await pinata.upload.public.fileArray(fileArray);

    const cid = upload.cid;
    const ipfsUrl = `ipfs://${cid}/`;

    console.log(`✅ Folder uploaded successfully: ${ipfsUrl}`);

    return {
      success: true,
      cid,
      ipfsUrl,
    };
  } catch (error) {
    console.error("❌ Error uploading folder to IPFS:", error);
    console.error("Error details:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get IPFS gateway URL from CID
 */
export function getIPFSGatewayUrl(cidOrUrl: string): string {
  // If already a full URL, return as is
  if (cidOrUrl.startsWith("http")) {
    return cidOrUrl;
  }

  // Remove ipfs:// prefix if present
  const cid = cidOrUrl.replace("ipfs://", "");

  // Use Pinata gateway
  const gateway = getGateway();
  return `https://${gateway}/ipfs/${cid}`;
}

/**
 * Convert gateway URL to ipfs:// URI
 */
export function gatewayUrlToIPFS(gatewayUrl: string): string {
  // Extract CID from gateway URL
  const match = gatewayUrl.match(/\/ipfs\/([^/]+)/);
  if (!match) {
    throw new Error("Invalid IPFS gateway URL");
  }

  return `ipfs://${match[1]}`;
}

/**
 * Test IPFS connection
 */
export async function testIPFSConnection(): Promise<boolean> {
  try {
    const testData = { test: "connection", timestamp: Date.now() };
    const result = await uploadJSON(testData, "test-connection");
    return result.success;
  } catch (error) {
    console.error("❌ IPFS connection test failed:", error);
    return false;
  }
}

export { pinata };
