import axios from "axios";

export default function NftUtils(apiKey: string) {
  return {
    client: axios.create({
      baseURL: `https://deep-index.moralis.io/api/v1/`,
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
      } = await this.client.get(`nft/wallet/${userAddy}`, {
        params: {
          chain,
          token_address: nftTokenAddy,
          format: "decimal",
          offset: 0,
          limit: 1e4,
          order: "name.DESC",
        },
      });
      return result;
    },
  };
}
