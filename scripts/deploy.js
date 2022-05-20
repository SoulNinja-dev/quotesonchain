const main = async () => {
  const quotesContractFactory = await hre.ethers.getContractFactory("Quotes");
  const quotesContract = await quotesContractFactory.deploy();
  await quotesContract.deployed();

  console.log("Deployed! ", quotesContract.address);

  let quotes = await quotesContract.getQuotes();
  console.log(`quotes before adding`, quotes);
};

main()
  .then(() => process.exit(0))
  .catch((err) => console.log(err));
