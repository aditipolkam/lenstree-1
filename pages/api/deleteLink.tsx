import { ethers } from "ethers";

//constants
const CONTRACT_ADDRESS = "0x65f590cb68a3f08c76e7fAA835Aa6453b2328d1F";
import contractAbi from ".././utils/contractAbi";

export default async function deleteLink(id: Number, address: String) {
  console.debug(id, address);
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
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}
