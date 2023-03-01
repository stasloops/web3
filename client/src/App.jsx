import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Web3 from 'web3'
import NFTContractBuild from '../../project-with-truffle/build/contracts/NFT.json'

function App() {
  const [minted, setMinted] = useState(false)
  // cd project-with-truffle

  let nftContract
  let selectedAccount

  const connectWallet = async () => {
    let provider = window.ethereum;

    if (typeof provider !== 'undefined') {
      const accounts = await provider.request({ method: 'eth_requestAccounts' })
      selectedAccount = accounts[0]
      console.log(selectedAccount);

      provider.on('accountsChanged', function (accounts) {
        selectedAccount = accounts[0];
        console.log(`Selected account changed to ${selectedAccount}`);
      });

      const web3 = new Web3(provider);

      const networkId = await web3.eth.net.getId();
      nftContract = new web3.eth.Contract(NFTContractBuild.abi, NFTContractBuild.networks[networkId].address);
    }
  }

  const mintNFT = async () => {
    nftContract.methods.mint(selectedAccount).send({from: selectedAccount})
    setMinted(true)
  }
    useEffect(() => {
    connectWallet()
  }, [])

  return (
    <div className="App">
      <button onClick={connectWallet}>Wallet</button>
      {
        !minted ?
          <button onClick={mintNFT}>Mint token</button>
          :
          <div>Token mint!</div>
      }
    </div>
  )
}

export default App
