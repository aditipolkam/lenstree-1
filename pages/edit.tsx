import { useState, useEffect, MouseEventHandler } from "react";
import { networks } from "./utils/networks";

import addNewLink from "./api/addNewLink";
import getAllLinks from "./api/getAllLinks";
import { link } from "fs";
import deleteLink from "./api/deleteLink";

//constants
const CONTRACT_ADDRESS = "0x65f590cb68a3f08c76e7fAA835Aa6453b2328d1F";

// import "../styles/edit.css";

export default function Edit() {
  const [network, setNetwork] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [links, setLinks] = useState<
    { id: number; name: string; url: string }[]
  >([]);
  const [inputs, setInputs] = useState<{ name: string; url: string }>({
    name: "",
    url: "",
  });

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log(inputs);
    await addNewLink(inputs.name, inputs.url);
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }
      if (ethereum) {
        const accounts = await ethereum?.request({
          method: "eth_requestAccounts",
        });
        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }

    const chainId = await ethereum.request({ method: "eth_chainId" });
    setNetwork(networks[chainId]);
    ethereum.on("chainChanged", handleChainChanged);

    // Reload the page when they change networks
    function handleChainChanged(chainId: any) {
      window.location.reload();
      chainId;
    }
  };

  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <button
        onClick={connectWallet}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    </div>
  );

  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13881" }],
        });
      } catch (error: any) {
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x13881" }],
            });
          } catch (error: any) {
            if (error.code === 4902) {
              try {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: "0x13881",
                      chainName: "Polygon Mumbai Testnet",
                      rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
                      nativeCurrency: {
                        name: "Mumbai Matic",
                        symbol: "MATIC",
                        decimals: 18,
                      },
                      blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
                    },
                  ],
                });
              } catch (error) {
                console.log(error);
              }
            }
            console.log(error);
          }
        }
        console.log(error);
      }
    } else {
      // If window.ethereum is not found then MetaMask is not installed
      alert(
        "MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html"
      );
    }
  };

  // async function newLink(e: MouseEventHandler) {
  //   const result = await addNewLink(
  //     ,
  //     "https://instagram.com/aditipolkam"
  //   );
  //   console.log(result);
  // }

  const renderLinks = () => (
    <div>
      wallet connected! Your current links are ={">"}
      <ul>
        {links.map((link) => {
          if (!link.url || !link.name) return;
          return (
            <div className="" key={link.id}>
              <a href={link.url} target={"_blank"} rel="noreferrer">
                {link.name}
              </a>
              <button className="ml-4" onClick={() => removeLink(link.id)}>
                Delete
              </button>
            </div>
          );
        })}
      </ul>
    </div>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    console.log("something Changed", currentAccount);
    async function fetchLinks() {
      const lks = await getAllLinks(currentAccount);
      if (lks) {
        setLinks(lks);
      }
    }
    fetchLinks();
  }, [currentAccount]);

  const removeLink = async (id: number) => {
    let status = await deleteLink(id, currentAccount);
    if (status) {
      setLinks((prev) => {
        return prev.filter((val, i) => val.id !== id);
      }); 
    }
  };

  return (
    <div className="container text-center flex flex-col align-middle justify-center p-6 ">
      <div className="header-container">
        <header>
          <div className="left">
            <h1 className="text-5xl font-Josefin">LensTree</h1>
          </div>
          <div className="right">
            {/* <Image alt="Network logo" className="logo" src={network.includes("Polygon") ? polygonLogo : ethLogo} /> */}
            {currentAccount ? (
              <p>
                {" "}
                Wallet: {currentAccount.slice(0, 6)}...
                {currentAccount.slice(-4)}{" "}
              </p>
            ) : (
              <p> Not connected </p>
            )}
          </div>
        </header>
      </div>
      {currentAccount ? renderLinks() : renderNotConnectedContainer()}
      <form
        onSubmit={handleSubmit}
        className="border-solid- border-2 border-black"
        action=""
      >
        <input
          className="text-xl text-center mr-4 border-solid- border-2 border-blue"
          type="text"
          name="name"
          id="name"
          placeholder="Name"
          onChange={handleChange}
        />
        ={">"}
        <input
          className="text-xl text-center ml-4 border-solid- border-2 border-blue"
          type="text"
          name="url"
          id="url"
          placeholder="URL"
          onChange={handleChange}
        />
        <br />
        <button
          className="text-l bg-red-300 min-h-[5vh] min-w-[5vw] rounded p-3 mt-4"
          type="submit"
        >
          Add Record
        </button>
      </form>
    </div>
  );
}
