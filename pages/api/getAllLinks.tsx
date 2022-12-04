import { ethers } from "ethers";

//constants
const CONTRACT_ADDRESS = "0x65f590cb68a3f08c76e7fAA835Aa6453b2328d1F";
import contractAbi from ".././utils/contractAbi";

export default async function getAllLinks(currentAccount: any) {
  console.log(currentAccount);
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
      const links = await contract.getLinks(currentAccount);
      if (links) {
        console.debug("Links", links);
        let returnable_links: {id: number, name: string, url:string}[] = [];
        for (let i = 0; i < links.length; i++) {
          console.log(i, links[i]);
          returnable_links.push({
            id: Number(links[i].id._hex),
            name: links[i].name,
            url: links[i].url,
          });
        }
        return returnable_links;
      } else {
        console.debug("Empty links")};
        return [];
    }
  } catch (error) {
    console.error(error);
  }
  return [];
}
