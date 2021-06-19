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

  parseCsvFileAsync(file: File, hasHeader: boolean = false) {
    // Parse CSV file using browser APIs
    // https://www.papaparse.com/
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: hasHeader,
        skipEmptyLines: true,
        complete: (results: any) => {
          resolve(results);
        },
        error: (err: any) => {
          reject(err);
        },
      });
    });
  },

  async parseCsvFile(file: File, hasHeader: boolean = false) {
    try {
      const parsed = await this.parseCsvFileAsync(file, hasHeader);

      const parsedData = parsed.data;
      const parsedHeaders = parsed.meta.fields;

      if (hasHeader && parsedHeaders && parsedHeaders.length > 0)
        return parsedData;

      return parsedData.map((data: Array<string>) => {
        const object: { [key: string]: string } = {};

        data.map((d: string, i: number) => {
          if (d) object[i] = d;
        });

        return object;
      });
    } catch (err) {
      throw new Error(err);
    }
  },
};
