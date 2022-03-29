import axios from "axios";

export default {
  async isUserAlphaValidated(address: string) {
    const {
      data: { validated },
    } = await axios.get(
      // `https://api.oklg.io/alpha/validated`,
      `http://localhost:8000/alpha/validated`,
      {
        params: {
          address,
        },
      }
    );
    return validated;
  },

  async validateSignature({ address, message, signature }: any) {
    const { data } = await axios.post(
      // `https://api.oklg.io/alpha/validate`,
      `http://localhost:8000/alpha/validate`,
      {
        address,
        message,
        signature,
      }
    );
    return data;
  },
};
