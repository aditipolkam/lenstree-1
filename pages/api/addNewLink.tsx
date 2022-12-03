import { ethers } from 'ethers';

//constants
const CONTRACT_ADDRESS = "0x65f590cb68a3f08c76e7fAA835Aa6453b2328d1F"
import contractAbi from '.././utils/contractAbi';

export default async function addNewLink(name:String, url:String){
    console.log(name, url)
    try{
      const { ethereum } = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
        //console.log(contract)
        let tx = await contract.addLink(name,url);
        tx.wait();
        console.log(tx);
        
      }
    }
    catch(error){
      console.error(error)
    }
}