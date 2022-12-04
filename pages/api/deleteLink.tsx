import { ethers } from "ethers";

//constants
const CONTRACT_ADDRESS = "0x65f590cb68a3f08c76e7fAA835Aa6453b2328d1F";
import contractAbi from ".././utils/contractAbi";

export default async function deleteLink(
  id: Number,
  name: String,
  url: String,
  address: String
) {
  console.log(name, url, id, address);
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractAbi.abi,
        signer
      );
      //console.log(contract)
      let tx = await contract.removeLink(address, id);
      tx.wait();
      console.log(tx);
    }
  } catch (error) {
    console.error(error);
  }
}
