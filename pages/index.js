import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Card from "../components/Card";
import abi from "../utils/Quotes.json";
import { Heading, Text, Input, Button } from "@chakra-ui/react";

export default function Home() {
  const [ethereum, setEthereum] = useState(undefined);
  const [connectedAccount, setConnectedAccount] = useState(undefined);
  const [quotes, setQuotes] = useState([]);
  const [newQuote, setNewQuote] = useState("");

  const contractAddress = "0xd7197d8382fe08b8B89Cfa6EFC2e2fc771944cAD";
  const contractABI = abi.abi;

  const handleAccounts = async (accounts) => {
    if (accounts.length > 0) {
      const acc = accounts[0];
      setConnectedAccount(acc);
      console.log(acc);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    await handleAccounts(accounts);
  };

  const getConnectedAccounts = async () => {
    if (window.ethereum) {
      setEthereum(window.ethereum);
    }

    if (ethereum) {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log(accounts);
      handleAccounts(accounts);
    }
  };

  const getQuotes = async () => {
    if (ethereum && connectedAccount) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const quotes = await contract.getQuotes();
      console.log(quotes);
      setQuotes(quotes);
    }
  };

  const addQuote = async (e) => {
    e.preventDefault();

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const quoteTx = await contract.addQuote(newQuote);
    await quoteTx.wait();
    console.log(quoteTx.hash);

    setNewQuote("");

    await getQuotes();
  };

  // use effect
  useEffect(() => {
    getConnectedAccounts();
  }, []);

  useEffect(() => {
    getQuotes();
  }, [connectedAccount]);

  if (!ethereum) {
    return <div>install metamask</div>;
  }

  if (!connectedAccount) {
    return (
      <button
        onClick={connectAccount}
        className="m-10 p-2 bg-gray-700 text-white text-xl rounded-lg"
      >
        connect browser wallet on goerli network
      </button>
    );
  }

  return (
    <>
      <nav className="bg-white shadow dark:bg-gray-800">
        <div className="container px-6 py-4 mx-auto md:flex md:justify-between md:items-center">
          <div className="flex items-center justify-between">
            <div>
              <Heading color="white">Quotes on chain</Heading>
            </div>
          </div>

          <div className="items-center md:flex">
            <div className="flex flex-col md:flex-row md:mx-6">
              <Text color="white">
                {connectedAccount.toString().substring(0, 4)}...
                {connectedAccount
                  .toString()
                  .substring(
                    connectedAccount.length - 4,
                    connectedAccount.length
                  )}
              </Text>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-col items-stretch w-screen">
        <div className="m-10">
          <form>
            <div className="pb-2">
              <label htmlFor="quote" className="font-bold">
                Enter quote
              </label>
            </div>
            <Input
              type="text"
              name="quote"
              value={newQuote}
              placeholder="gm"
              autoComplete="off"
              onChange={(e) => {
                setNewQuote(e.target.value);
              }}
              width="100%"
            />
            <br />
            <Button
              className="mt-5"
              type="submit"
              onClick={addQuote}
              bgColor="gray.700"
              color="white"
              _hover={{ bg: "gray.600" }}
            >
              Add Quote
            </Button>
          </form>
        </div>

        <div>
          {quotes.map((quote, index) => (
            <Card key={index} quote={quote} />
          ))}
        </div>
      </div>
    </>
  );
}
