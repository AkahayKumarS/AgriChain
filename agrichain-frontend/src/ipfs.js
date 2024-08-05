import { create } from "ipfs-http-client";

const ipfs = create({ host: "localhost", port: 5002, protocol: "http" });

export default ipfs;
