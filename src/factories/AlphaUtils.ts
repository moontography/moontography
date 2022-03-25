import axios from "axios";

export default {
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
