import { ethers } from 'ethers';

//constants
const CONTRACT_ADDRESS = "0x65f590cb68a3f08c76e7fAA835Aa6453b2328d1F"
import contractAbi from '.././utils/contractAbi';

export default async function getAllLinks(currentAccount:any){
    console.log(currentAccount)
    try{
      const { ethereum } = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
        //console.log(contract)
        const links = await contract.getLinks(currentAccount);
        if(links){
          console.log(links);
          return links;
        }
        else 
          console.log("Empty links")
      }
    }
    catch(error){
      console.error(error)
    }
}