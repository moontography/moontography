import Papa from "papaparse";

export default {
  async sha256(file: File): Promise<string> {
    return this.bufferToHex(await this.hashFileSha256(file));
  },

  async hashFileSha256(file: File): Promise<ArrayBuffer> {
    // Hash a File object.
    // Returns a Promise of a successful hash.
    return await new Promise(function (resolve, reject) {
      const fileReader = new FileReader();
      fileReader.addEventListener("load", async function () {
        try {
          const res: ArrayBuffer = await crypto.subtle.digest(
            "SHA-256",
            (this as any).result
          );
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
      fileReader.readAsArrayBuffer(file);
    });
  },

  bufferToHex(buffer: ArrayBuffer): string {
    // Convert a buffer into a hexadecimal string.
    // From https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
    const hexCodes = [];
    const view = new DataView(buffer);

    for (let i = 0; i < view.byteLength; i += 4) {
      // Using getUint32 reduces the number of iterations needed (we process
      // 4 bytes each time).
      const value = view.getUint32(i);
      // toString(16) will give the hex representation of the number without
      // padding
      const stringValue = value.toString(16);
      // We use concatenation and slice for padding.
      const padding = "00000000";
      const paddedValue = (padding + stringValue).slice(-padding.length);
      hexCodes.push(paddedValue);
    }

    return hexCodes.join("");
  },

  parseCsvFileAsync(file: File) {
    // Parse CSV file using browser APIs
    // https://www.papaparse.com/
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (results: any) => {
          resolve(results.data);
        },
        error: (err: any) => {
          reject(err);
        },
      });
    });
  },

  async parseCsvFile(file: File) {
    try {
      return await this.parseCsvFileAsync(file);
    } catch (err) {
      throw new Error(err);
    }
  },
};
