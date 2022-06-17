import axios from "axios";

export default function NftUtils(apiKey: string) {
  return {
    client: axios.create({
      baseURL: `https://deep-index.moralis.io/api/v2/`,
      headers: {
        "X-API-Key": apiKey,
      },
    }),

    async getNftsOwnedByUser(
      nftTokenAddy: string,
      userAddy: string,
      chain: string = "eth"
    ) {
      const {
        data: { /* total, page, page_size, */ result },
      } = await this.client.get(`${userAddy}/nft/${nftTokenAddy}`, {
        params: {
          chain,
          format: "decimal",
          cursor: null,
          limit: 100,
          // order: "name.DESC",
        },
      });
      return result;
    },

    fixTokenUriURL(url: string) {
      if (url.startsWith("ipfs")) {
        return `https://ipfs.moralis.io:2053/ipfs/${
          url.split("ipfs://ipfs/").slice(-1)[0]
        }`;
      } else {
        return `${url}?format=json`;
      }
    },

    fixImageURL(url: string) {
      if (url.startsWith("ipfs")) {
        return `https://ipfs.moralis.io:2053/ipfs/${
          url.split("ipfs://").slice(-1)[0]
        }`;
      }
      return url;
    },
  };
}
