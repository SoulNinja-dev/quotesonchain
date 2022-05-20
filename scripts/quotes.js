const main = async () => {
  const quotesContractFactory = await hre.ethers.getContractFactory("Quotes");
  const quotesContract = await quotesContractFactory.deploy();
  await quotesContract.deployed();

  let quotes = await quotesContract.getQuotes();
  console.log(`quotes before adding`, quotes);

  // adding quote
  const quoteTx = await quotesContract.addQuote("gm");
  await quoteTx.wait();

  quotes = await quotesContract.getQuotes();
  console.log(`quotes after adding`, quotes);
};

main()
  .then(() => process.exit(0))
  .catch((err) => console.log(err));
