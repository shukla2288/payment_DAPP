import {useEffect, useState } from 'react';
import './App.css';
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from './utils/load-contract';
import contract from '@truffle/contract';


function App() {
   
  const[web3Api, setWeb3Api]=useState({
   provider:null,
   web3:null,
   contract:null
  })

const[account,setAccount] =useState(null);
const[balance,setBalance] =useState(null);
const[reload,shouldReload] =useState(false);


const reloadEffect=()=> shouldReload(!reload);
  useEffect(()=>{
    const loadProvider= async()=>{
 const provider= await detectEthereumProvider();
 const contract= await loadContract("Funder",provider);
 if(provider){
  provider.request({method:"eth_requestAccounts"});
  setWeb3Api({
    web3:new Web3(provider),
    provider,
    contract
  });
 }
 else{
  console.error('please install metamask!')
 }
  // if(window.ethereum){
  //   provider=window.ethereum;
  // try{
  //   await provider.enable();
  // } catch{
  //   console.error("user is not allowed")
  // }
  //   }else if(window.web3){
  //     provider= window.web3.currentProvider;
  //   } else if(!process.env.production){
  //     provider=new Web3.providers.HttpProvider("http://localhost:7545");
  //   }
    
  };
    loadProvider();
   },[]);

   useEffect(()=>{
const loadBalance= async ()=>{
  const{contract,web3}= web3Api;
  const balance= await web3.eth.getBalance(contract.address); 
  setBalance(web3.utils.fromwei(balance,"ether")) ;

};
web3Api.contract && loadBalance();
   },[web3Api,reload]);

   const transferFund= async()=>{
    const{web3,contract}= web3Api;
    await contract.transfer({
      from:account,
      value:web3.utils.toWei("2","ether"),
    });
    reloadEffect();
   };

const withdrawFund=async()=>{
  const {contract,web3}= web3Api;
  const withdrawAmount= web3.utils.toWei("2","ether");
  await contract.withdraw(withdrawAmount,{
    from:account
  })
  reloadEffect();
}



   useEffect(()=>{
    const getAccount= async()=>{
      const accounts = await web3Api.web3.eth.getAccounts()
      setAccount(accounts[0])
    }
    web3Api.web3 && getAccount()
   },[web3Api.web3])

   //console.log(web3Api.web3);
  return (
    <>
    <div class="card text-center">
    <div class="card-header">Funding</div>
    <div class="card-body">
      <h5 class="card-title">Balance: {balance} </h5>
      <p class="card-text">
        Account :{account ? account :"not connected"}
      </p>
    {/* <button
        type="button"
        class="btn btn-success"
        onClick={async()=>{
          const accounts= await window.ethereum.request({method:"eth_requestAccounts",

          });
          console.log(accounts);
        }}>
        Connect to metamask
      </button>  */}
      &nbsp;
      <button type="button" class="btn btn-success " 
      onClick={transferFund}>
        Transfer
      </button>
      &nbsp;
      <button type="button" class="btn btn-primary "  
      onClick={withdrawFund}>
        Withdraw
      </button>
    </div>
    <div class="card-footer text-muted">Gphonetm</div>
  </div>
  </>
  );
}

export default App;