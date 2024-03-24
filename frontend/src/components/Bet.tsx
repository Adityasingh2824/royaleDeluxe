import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  newRandomVal,
  newResultVal,
  setAnimationVal,
  updateBalanceVal,
} from "../store";
import { BrowserView, MobileView } from 'react-device-detect';
import Tooltip from '@mui/material/Tooltip';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { RD,aptosnet } from "./config";
import { ViewRequest,Provider,AptosClient } from "aptos";



const Bet = (props) => {
   
  const dispatch = useDispatch();
  let [stakeValue, setStakeValue] = useState(10000000);
  let [targetValue, setTargetValue] = useState(5.0);

  // Import global value from Redux
  const animationShow = useSelector((state:any) => state.clientReduxStore.animationVisible);
  const userBalance = useSelector((state:any) => state.clientReduxStore.balance);

  const {
        account,
        connected,
        disconnect,
        network,
        wallet,
        connect,
        signAndSubmitTransaction,
  } = useWallet();
    const mintAudio = new Audio('./fournier.wav');
   
  
  const view_fct_2 = async () => {
       if (!account) {
         throw new Error("Account not connected");
       }
       const prov = new Provider(aptosnet);
       const payload: ViewRequest = {
         function: `${RD}::playdcrash::view_balance`,
         type_arguments: [],
         arguments: [account.address],
       };
       try {
         const viewresponse = await prov.view(payload);
         dispatch(updateBalanceVal(viewresponse[0].instrumentBalanceSmart));
         if (stakeValue > viewresponse[0].instrumentBalanceSmart) {
           setStakeValue(viewresponse[0].instrumentBalanceSmart);
         }
       } catch (error) {
          
       };
     };
    
     const view_fct_3 = async () => {
       if (!account) {
         throw new Error("Account not connected");
       }
       const prov = new Provider(aptosnet);
       const payload: ViewRequest = {
         function: `${RD}::playdcrash::view_result`,
         type_arguments: [],
         arguments: [account.address],
       };
       try {
         const viewresponse = await prov.view(payload);
         dispatch(newRandomVal(viewresponse[0].randResult / 1000000));
         dispatch(setAnimationVal(true));
         if (viewresponse[0].randResult > viewresponse[0].target) {
           dispatch(newResultVal(viewresponse[0].payment / 100000000));
         }
         else {
           dispatch(newResultVal(-viewresponse[0].payment / 100000000));
         }
         setTimeout(updateBalance, 3200);
       } catch (error) {
        
       };
     };
   
    async function updateBalance () {
      dispatch(setAnimationVal(false));
      view_fct_2();
      mintAudio.pause();
     };
 
     async function submitdxbx() {
      let payload = {};
       if (!account) {
         alert('Connect Wallet First ')
         throw new Error("Account not connected");
       }
       console.log('Account', account,stakeValue, targetValue, true);
       payload = {
         type: "entry_function_payload",
         function: RD + "::playdcrash::royale_crash",
         type_arguments: [],
         arguments: [stakeValue, targetValue, true],
       };
       try {
         const response = await signAndSubmitTransaction({ payload });
         const result = view_fct_3();
         //mintAudio.play();
       } catch (error) {
         console.error('signAndSubmitTransactio error', error);
         const response = await disconnectWallet();
       }
     };
  
  const betFunction = () => {
    submitdxbx();
  };
    
  const depositBlinking = () => {
    if (userBalance > 1000000) { 
      return 'btn start-button-browser borderBlink';
    }
    else {
      return 'btn start-button-browser';
     
    }
  }
  
   const pointsMinus = () => {
    if (stakeValue >= 10000000)
    setStakeValue(stakeValue - 10000000);
  };

  const pointsPlus = () => {
  //  console.log('pointsPlus', userBalance);
    if (userBalance > stakeValue + 10000000)
     setStakeValue(stakeValue + 10000000);
  };


  const betMax = () => {
    setStakeValue(userBalance);
   };
  
  function getStakeValue() {
    return stakeValue / 100000000;
  }

  return (
    <>
    <BrowserView>
    <div className="start-section">
      <div className="row mb-3">
        <div className="col-12 col-md-12">
          
          <div className="card-box spin">
                 <div className="explaingame">BET  
                 </div>
            <div className="spin-menu-browser">
              <div className="spin-minus option" onClick={pointsMinus}>
                ▼
                   </div>

                   <div className="midInputbrowser" >
                  <img  className="aptlogo" src="Aptos_mark_WHT.svg"/>                  
                   <input disabled
                     type="number"
                     className="spininputbrowser"
                     onChange={(e: any) => setStakeValue(e.target.value)}
                     value={ (stakeValue/ 100000000).toFixed(4) } 
                   >
                  </input>
                  </div>
              <button className="spin-plus option" onClick={pointsPlus}>
                ▲
                   </button>
                 <button className="maxbutton" onClick={betMax} >max</button>      
                 </div>
                 
               </div>
          
        </div>

        <div className="col-12 col-md-12">
          <div className="card-box spin">
                 
                 <div className="explaingame">
                  
                   THAT YOU HIT
                   <div >
                   <button className="targetclass"   onClick={betFunction}>5</button>
              </div>
                
              
            </div>
          </div>
        </div>
      </div>
        
             
           <button title="Start the game" data-toggle="tooltip" data-placement="bottom"
             className={animationShow?"btn start-button-browser":depositBlinking()}
        onClick={betFunction}
        disabled={animationShow}
      >
        {animationShow ? "Started" : "START"}
      </button>

         </div>
        
     </BrowserView>
     <MobileView>
         <div className="start-section">
      <div className="row mb-3">
        <div className="col-12 col-md-12">
          <div className="card-box info-box spin">
                 <div className="spin-title">PLAY
                   <img src="Aptos_mark_WHT.svg" height={20} width={20} />
                 </div>
            <div className="spin-menu">
              <div className="spin-minus option" onClick={pointsMinus}>
                     ▼
                   </div>
              <input disabled
                type="number"
                className="spin-input"
                min="0"
                max={userBalance}
                onChange={(e: number) => setStakeValue(e.target.value)}
                value={getStakeValue()} 
              />
              <div className="spin-plus option" onClick={pointsPlus}>
                ▲
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-12">
          <div className="card-box info-box spin">
                 <div className="spin-title"><img src="rocket.svg" height={35} width={35}/>Reaches 5</div>
            
          </div>
        </div>
      </div>
      <button title="Start the game" data-toggle="tooltip" data-placement="bottom"
        className="btn btn-primary start-button-mobile"
        onClick={betFunction}
             disabled={animationShow}
       >
        {animationShow ? "Started" : "LAUNCH"}
      </button>
       </div>
         
       </MobileView>
     
</>
  );
}
export default Bet;
