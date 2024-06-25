import React, { useEffect, useState,useMemo } from "react";
import anime from 'animejs';
import CountUp from "react-countup";
import Royale from "/Royale.svg";
import Confetti from "react-confetti";
import {
  updateBalanceVal,

} from "./store";
import Bet from "./components/Bet";
import Info from "./components/Info";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import PlayerBoard from "./components/PlayerBoard/PlayerBoard";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";
import {
    ViewRequest,
    AptosAccount,
    Provider,
} from "aptos";

import { BrowserView, MobileView } from 'react-device-detect';
import { useSelector, useDispatch } from "react-redux";
import { RD,aptosnet } from "./components/config";




const ConnectedFunctionalities = (props) => {
    const dispatch = useDispatch();
    const [openButtonVisible, setOpenButtonVisible] = useState(false);
    let isOwner: bool =false
    const {
      account,
      connected,
      network,
      disconnect,
      signAndSubmitTransaction,
    } = useWallet();
  
    useEffect(() => {
      if (connected) {
        console.log('Connected useEffecti', account);
        setTimeout(() => {
          view_fct_2(); 
        }, 500);
        depositBlinking();
      }
    }, [account,signAndSubmitTransaction]);

    if (connected) {
        if (account?.address === RD) {
          isOwner=true;
    
      }
  }
  const userBalance = useSelector((state: any) => state.clientReduxStore.balance);
  
    const submitdxbx = (functionName: string, myparam:number =0) => async () => {
        let payload={};
        console.log('submittoModule', functionName);
        if (!account) {
            throw new Error("Account not connected");
        }
        console.log('Account', account);
        switch (functionName) {
            case 'init_market_entry': {
                      payload = {
              type: "entry_function_payload",
              function: RD + "::playdcrash::init_market_entry",
              type_arguments: [],
              arguments: [],
            };
          };
            break;
                
          case 'open_customer_account_entry': {
            payload = {
              type: "entry_function_payload",
              function: RD + "::playdcrash::open_customer_account_entry",
              type_arguments: [],
              arguments: [],
            };
          };
            break;
          case 'deposit_to_market_account_entry': {
            payload = {
              type: "entry_function_payload",
              function: RD + "::playdcrash::deposit_to_market_account_entry",
              type_arguments: [],
              arguments: [100000000],
            };
          };
            break;
          case 'withdraw_from_market_account': {
            payload = {
              type: "entry_function_payload",
              function: RD + "::playdcrash::withdraw_from_market_account_entry",
              type_arguments: [],
              arguments: [100000000],
                }; 
                };
                    break;
                
                case 'send_reset_account_entry': {
                    payload = {
                        type: "entry_function_payload",
                        function: RD + "::playdcrash::send_reset_account_entry",
                        type_arguments: [],
                        arguments: [],
                }; 
                };
                    break;
                case 'RESET_IT_ALL': {
                    payload = {
                        type: "entry_function_payload",
                        function: RD + "::playdcrash::send_reset_account_entry",
                        type_arguments: [],
                        arguments: [],
                }; 
                };
                    break;
              default: { }
          };
          console.log('payload', payload);    
          try {
            const response = await signAndSubmitTransaction({payload});
            console.log("Transaction Submitted", response.hash);
            await view_fct_2();
          } catch (error) {
            console.error('signAndSubmitTransactio error',error);
            await disconnectWallet();
          }
      }

  const disconnectWallet = async () => {  
      console.log('disconnectWallet',connected, account?.address);
      dispatch(updateBalanceVal(0));
    try{
      const response = await disconnect();
    }catch(error){
      console.log('error catch disconnect',error);
      window.location.reload(false);
    }
  }
  
  const view_fct_2 = async () => {
    if(!account){
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
      setOpenButtonVisible(false);
    } catch (error) {
      setOpenButtonVisible(true);
    } 
  }

  function formatAddress(account: AptosAccount) {
    return account.address.toString().slice(0, 6) + "..." + account.address.toString().slice(-6);
  }

  function formatBalance(balance: number) {
    return balance/10e7;
  }

 const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
 const open = Boolean(anchorEl);
 const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
   setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const depositBlinking = () => {
    if (userBalance > 10000000) { 
      return 'wallet-button btn btn-primary';
    }
    else {
      return 'wallet-button btn btn-primary borderBlink';
    }
  }

  return (
    <div >
      <button
        className=' wallet-button btn btn-primary'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {"User-" + account?.address.slice(-6)}
        </button>
        <Menu
        id="basic-menu"
        className='basicmenu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={disconnectWallet} className='menuitem'>Logout</MenuItem>
      </Menu>
      
  { openButtonVisible &&  <Tooltip className="tooltipmain"  title="CREATE DEPOSIT ACCOUNT"  placement="top-start"> <button
        className=' wallet-button btn btn-primary borderBlink'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={submitdxbx('open_customer_account_entry', 1)}
      >
        {"Open Account"}
      </button>
      </Tooltip>}

      
      {!openButtonVisible && <button
        className={depositBlinking()}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={submitdxbx('deposit_to_market_account_entry', 1)}
      >
        {"Deposit 1"}
      </button>}

      {!openButtonVisible && <button
        className=' wallet-button btn btn-primary'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={submitdxbx('withdraw_from_market_account', 1)}
      >
        {"Withdraw 1"}
      </button>}
    
      
    
    </div>

  )
}

const CrashAnimation =() =>{
 
  const animeStarted = useSelector((state) =>  state.clientReduxStore.animationVisible     );
  const [confettiVisible, setConfettiVisible] = useState(false);
    const [resultDialogVisible, setResultDialogVisible] = useState(false);
  
  useEffect(() => {
    if (animeStarted)
        startAnimationBackground(4200);
     }, [animeStarted]);

  let requestID_Stars;

  const random = (min, max) => Math.random() * (max - min) + min;

  const initStar = () => {
    const star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    star.setAttribute('r', random(3, 22));
    star.setAttribute('cx', random(1050, 2000));
    star.setAttribute('cy', random(-450, -2000));
    star.setAttribute('fill', '#898989');
    return star;
  };

  const startAnimationBackground = (duration) => {
      console.log('startAnimationBackground');
    
    const rocket = document.querySelector('.rocketbody');
    const engines = [...document.querySelectorAll('.rocketengine')];
    const delay = 0;
    let now = Date.now();
    let then = Date.now();
    let elapsed = 0;

    let playAnimationBackground = () => {
      now = Date.now();
      elapsed = now - then;
      if(elapsed > delay) {
        engines.map(flame => {
        flame.style.transform = `scale(${random(0.7, 1)}, ${random(0.78, 1)})`;
        });
          then = Date.now();
      }
      let starDuration = 0;
      const randomStar = random(0, 5);
      if (randomStar > 2) {
        const star = initStar();
        rocket.insertBefore(star, rocket.firstChild);
        const starDimension = star.getAttribute('r');

        if (starDimension < 7) {
          starDuration = duration*1.15;
          star.style.opacity = random(0.5, 0.7);
        } else if (starDimension < 10) {
          starDuration = duration*1.05;
          star.style.opacity = random(0.6, 0.8);
        } else if (starDimension < 18) {
          starDuration = duration*.95;
          star.style.opacity = random(0.7, 0.9);
        } else {
          starDuration = duration*.75;
          star.style.opacity = random(0.8, 0.95);
        }
        
        anime({
          targets: star,
          translateX: [
            { value: -3000, duration: starDuration, easing: 'linear', }
          ],
          translateY: [
            { value: 3000, duration: starDuration, easing: 'linear', }
          ],
          complete: () => {
            star.remove();
          },
        });
        }
        requestID_Stars = requestAnimationFrame(playAnimationBackground);
    
      }

    requestAnimationFrame(playAnimationBackground);

    const toggleConfetti = () => {
      setConfettiVisible(true);
      setResultDialogVisible(true);
      setTimeout(() => {
        setConfettiVisible(false);
        setResultDialogVisible(false);
    },5200);

    }

    setTimeout(() => {
      stopAnimationBackground();
      toggleConfetti();
      
    },duration);
  };

  const stopAnimationBackground = () => cancelAnimationFrame(requestID_Stars);

function Myconfetti() { 

  return (
    
    <Confetti  style={{ height: '100%', width: '100%' }}
      numberOfPieces={1000}
      recycle={false}
    
      />
    
  );
}

//{resultDialogVisible && <DialogPlayAgain />}
  return (
    <div className="animationcontainer">

      {confettiVisible && <Myconfetti />}
      {resultDialogVisible && <DialogPlayAgain />}

<svg xmlns="http://www.w3.org/2000/svg"
	 version="1.1" id="Layer_1" className="rocketbody" viewBox="80 -300 700 900">
	<g >
		<g id="XMLID_65_">
			<g>
				<g>
					<path fill="#FF7124" d="M399.76,16.699c10.12,37.84,8.67,78.13-4.34,115.28h-0.01L284.48,21.049v-0.01      C321.63,8.029,361.92,6.579,399.76,16.699z"/>
				</g>
				<g>
					<path fill="#F2D59F" d="M90.21,207.929l87.14-101.42h0.01l33.71-39.24c21.43-21.43,46.6-36.84,73.41-46.23v0.01      l110.93,110.93h0.01c-9.39,26.81-24.8,51.98-46.23,73.41l-39.24,33.71l-101.43,87.14l-29.57-29.57l-29.58-29.58l-29.58-29.58      L90.21,207.929z M296.11,193.399c20.18-20.17,20.18-52.89,0-73.06c-20.17-20.18-52.89-20.18-73.06,0      c-20.18,20.17-20.18,52.89,0,73.06C243.22,213.579,275.94,213.579,296.11,193.399z"/>
				</g>
				<g>
					<path fill="#F2D59F" d="M309.95,239.099c1.74,45.6-14.8,91.78-49.61,126.59c-10.69,10.68-22.44,19.65-34.93,26.89      l-16.89-66.34L309.95,239.099z"/>
				</g>
				<g>
					<path fill="#8ECAC1" d="M296.11,120.339c20.18,20.17,20.18,52.89,0,73.06c-20.17,20.18-52.89,20.18-73.06,0      c-20.18-20.17-20.18-52.89,0-73.06C243.22,100.159,275.94,100.159,296.11,120.339z"/>
				</g>
				<g>
					<path fill="#E6B263" d="M208.52,326.239l-39.94,14.71c-10.98,4.05-23.31,1.34-31.58-6.94l-6.85-6.85l48.8-30.49      L208.52,326.239z"/>
				</g>
				<g>
					<polygon fill="#E6B263" points="178.95,296.669 130.15,327.159 130.14,327.159 109.72,306.739 149.37,267.089     "/>
				</g>
				<g>
					<path fill="#F2D59F" d="M177.35,106.509l-87.14,101.42l-66.33-16.88c7.24-12.49,16.21-24.24,26.89-34.93      C85.58,121.309,131.74,104.769,177.35,106.509z"/>
				</g>
				<g>
					<polygon fill="#E6B263" points="149.37,267.089 109.72,306.739 89.3,286.309 119.79,237.509     "/>
				</g>
				<g>
					<path fill="#E6B263" d="M119.79,237.509l-30.49,48.8l-6.86-6.85c-8.27-8.28-10.98-20.6-6.94-31.58l14.71-39.95      L119.79,237.509z"/>
				</g>
			</g>
			<g>
				<g>
					<path className="rocketengine" fill="#5E2A41" d="M28.88,339.459c-2.559,0-5.119-0.977-7.071-2.929c-3.905-3.905-3.905-10.237,0-14.143      l20.54-20.54c3.905-3.904,10.237-3.904,14.143,0c3.905,3.905,3.905,10.237,0,14.143l-20.54,20.54      C33.999,338.482,31.44,339.459,28.88,339.459z"/>
				</g>
				<g>
					<path className="rocketengine" fill="#5E2A41" d="M10,416.439c-2.56,0-5.119-0.977-7.072-2.93c-3.905-3.905-3.904-10.237,0.001-14.142l68.47-68.46      c3.905-3.904,10.237-3.904,14.142,0.001c3.905,3.905,3.904,10.237-0.002,14.142l-68.47,68.46      C15.118,415.463,12.559,416.439,10,416.439z"/>
				</g>
				<g>
					<path className="rocketengine" fill="#5E2A41" d="M73.29,411.259c-2.56,0-5.118-0.977-7.071-2.929c-3.905-3.905-3.905-10.237,0-14.143      l34.23-34.229c3.905-3.904,10.237-3.903,14.142,0c3.905,3.905,3.905,10.237,0,14.143l-34.23,34.229      C78.409,410.282,75.849,411.259,73.29,411.259z"/>
				</g>
				<g>
					<path fill="#5E2A41" d="M208.52,336.239c-2.56,0-5.118-0.977-7.071-2.929L83.139,215c-3.905-3.905-3.905-10.237,0-14.143      c3.905-3.904,10.237-3.904,14.143,0l118.31,118.311c3.905,3.905,3.905,10.237,0,14.143      C213.639,335.263,211.079,336.239,208.52,336.239z"/>
				</g>
				<g>
					<path fill="#5E2A41" d="M259.58,218.534c-16.474,0-31.959-6.416-43.604-18.066c-11.646-11.641-18.062-27.126-18.062-43.6      c0-16.474,6.416-31.959,18.065-43.604c11.641-11.646,27.126-18.062,43.6-18.062s31.959,6.416,43.604,18.065      c11.645,11.641,18.061,27.126,18.061,43.6c0,16.472-6.415,31.956-18.061,43.6l0,0c-0.001,0.002-0.001,0.001-0.004,0.004      C291.536,212.119,276.052,218.534,259.58,218.534z M259.58,115.204c-11.13,0-21.592,4.334-29.457,12.204      c-7.874,7.869-12.208,18.331-12.208,29.461s4.334,21.592,12.204,29.457c7.869,7.874,18.331,12.208,29.461,12.208      c11.13,0,21.592-4.334,29.457-12.204c0.002-0.001,0.003-0.002,0.004-0.004c7.87-7.865,12.204-18.327,12.204-29.457      s-4.334-21.592-12.204-29.457C281.172,119.538,270.71,115.204,259.58,115.204z"/>
				</g>
				<g>
					<path fill="#5E2A41" d="M89.291,296.31c-1.81,0-3.642-0.49-5.29-1.521c-4.684-2.926-6.108-9.096-3.182-13.779l30.49-48.8      c2.927-4.684,9.097-6.11,13.78-3.182c4.684,2.926,6.108,9.096,3.182,13.779l-30.49,48.8      C95.884,294.643,92.625,296.31,89.291,296.31z"/>
				</g>
				<g>
					<path fill="#5E2A41" d="M109.72,316.739c-2.559,0-5.118-0.977-7.071-2.929c-3.905-3.905-3.906-10.237-0.001-14.143      l39.65-39.65c3.905-3.904,10.237-3.904,14.142,0c3.905,3.905,3.906,10.237,0.001,14.142l-39.65,39.65      C114.839,315.763,112.279,316.739,109.72,316.739z"/>
				</g>
				<g>
					<path fill="#5E2A41" d="M130.16,337.16c-3.334,0-6.593-1.666-8.49-4.702c-2.926-4.684-1.501-10.854,3.182-13.779      l48.8-30.49c4.683-2.929,10.853-1.503,13.78,3.182c2.926,4.684,1.501,10.853-3.182,13.779l-48.8,30.49      C133.801,336.67,131.97,337.16,130.16,337.16z"/>
				</g>
				<g>
					<path fill="#5E2A41" d="M177.356,116.509c-2.307,0-4.625-0.794-6.512-2.415c-4.189-3.599-4.668-9.912-1.069-14.102      l33.71-39.24c3.598-4.188,9.911-4.668,14.102-1.068c4.189,3.599,4.668,9.912,1.068,14.101l-33.71,39.24      C182.968,115.327,180.17,116.509,177.356,116.509z"/>
				</g>
				<g>
					<path fill="#5E2A41" d="M158.265,352.787c-10.448,0-20.723-4.085-28.34-11.712l-6.582-6.582      c-0.093-0.086-0.184-0.173-0.273-0.263l-47.694-47.695c-10.992-11.006-14.623-27.531-9.259-42.109l14.71-39.952      c0.413-1.12,1.022-2.157,1.799-3.061l87.14-101.42c3.601-4.188,9.913-4.667,14.102-1.068c4.189,3.6,4.667,9.913,1.068,14.102      L98.971,213.077l-14.086,38.257c-2.682,7.289-0.864,15.556,4.632,21.059l47.432,47.433c0.092,0.086,0.184,0.173,0.273,0.263      l6.85,6.85c5.497,5.504,13.756,7.318,21.048,4.63l38.252-14.089l139.302-119.675c4.191-3.6,10.504-3.119,14.102,1.068      c3.6,4.189,3.121,10.503-1.068,14.102L215.036,333.824c-0.904,0.777-1.94,1.387-3.059,1.799l-39.941,14.71      C167.557,351.985,162.893,352.787,158.265,352.787z"/>
				</g>
				<g>
					<path fill="#5E2A41" d="M349.19,215.389c-2.559,0-5.118-0.977-7.071-2.929c-3.905-3.905-3.905-10.237,0-14.143      c19.885-19.884,34.642-43.315,43.863-69.644c11.736-33.512,13.626-69.25,5.536-103.733c-34.48-8.089-70.221-6.199-103.733,5.536      c-26.329,9.221-49.761,23.979-69.645,43.863c-3.905,3.904-10.236,3.905-14.143,0c-3.905-3.905-3.905-10.237,0-14.143      c22.025-22.024,47.991-38.375,77.176-48.596C320.331-2.111,362.231-3.69,402.344,7.039c3.454,0.924,6.152,3.622,7.076,7.076      c10.728,40.114,9.151,82.014-4.563,121.17c-10.221,29.185-26.571,55.15-48.596,77.175      C354.309,214.412,351.75,215.389,349.19,215.389z"/>
				</g>
				<g>
					<path fill="#5E2A41" d="M395.41,141.98c-2.56,0-5.118-0.977-7.071-2.929L277.409,28.12      c-3.905-3.905-3.905-10.237,0-14.143c3.908-3.905,10.238-3.903,14.143,0l110.93,110.931c3.905,3.905,3.905,10.237,0,14.143      C400.528,141.003,397.969,141.98,395.41,141.98z"/>
				</g>
				<g>
					<path fill="#5E2A41" d="M90.22,217.929c-0.832,0-1.67-0.104-2.477-0.309l-66.33-16.88      c-3.037-0.773-5.537-2.926-6.751-5.814c-1.215-2.889-1.005-6.181,0.566-8.892c7.778-13.418,17.355-25.86,28.467-36.982      c35.281-35.281,84.119-54.445,133.988-52.537c5.369,0.176,9.671,4.583,9.671,9.994c0,5.522-4.472,10-9.995,10h-0.01      c-0.127,0-0.254-0.002-0.381-0.007c-44.338-1.699-87.765,15.325-119.127,46.688c-6.684,6.689-12.742,13.914-18.101,21.576      l52.73,13.419c4.435,1.024,7.745,4.998,7.745,9.743C100.215,213.451,95.743,217.929,90.22,217.929z"/>
				</g>
				<g>
					<path fill="#5E2A41" d="M225.41,402.579c-1.315,0-2.633-0.259-3.876-0.782c-2.89-1.215-5.042-3.714-5.815-6.75      l-16.891-66.34c-1.363-5.353,1.872-10.796,7.224-12.158c5.349-1.366,10.795,1.871,12.158,7.223l13.48,52.948      c7.663-5.359,14.889-11.419,21.581-18.104c31.36-31.36,48.378-74.785,46.684-119.136c-0.21-5.519,4.093-10.163,9.611-10.374      c5.509-0.233,10.164,4.093,10.375,9.611c1.903,49.897-17.243,98.755-52.532,134.044c-11.124,11.113-23.567,20.691-36.986,28.47      C228.881,402.126,227.148,402.579,225.41,402.579z"/>
				</g>
			</g>
		</g>
	</g>

</svg>

    </div>
  );
}

const WConnector = () => { 
  const {
    connected,
  } = useWallet();
  
  useEffect(() => {

    if (connected) {
      console.log('Connected useEffecti', connected);
    }
  }, [connected]);
  


  const depositBlinking = () => {
    if (connected ) { 
      return '';
    }
    else {
      return 'connect-button-browser  borderBlink ';
    }
  }
  return (
    <div>
  <div className={depositBlinking()}>
        {!connected && <WalletConnector  />}
        </div>
      { connected && <ConnectedFunctionalities /> }
  </div>
      )
}

function DialogPlayAgain() {
  const lastWinning = useSelector((state) => state.clientReduxStore.lastResultVal);
  if (lastWinning > 0) {
    return (
      <div className=" dialogwin">
        WIN {lastWinning}
      </div>)
  } else {
    let myval=Math.abs(lastWinning);
    return (
      <div>
      <div className=" dialogloose">
        
          { lastWinning} 
        </div>
         <div className="dialogl2">  PLAY AGAIN</div>  
      </div>
      )
    
    
  }

}

function App() {

  const generatedValue = useSelector((state) => state.clientReduxStore.lastRandomVal);
  const animationDuration = useSelector((state) => state.clientReduxStore.animationDuration);
  

  return (
    <div className="App">
      
      <div className="container-fluid">
    
        <div className="mytext">
          BrowserView ONLY
          
          </div>
        <div className="dummyView">
     
          
</div>
        <div className="row mt-5">
          <div className="col-12">
            
            <div className="col-4">
              
              <div className=" walletConnector" title="Please, connect to RANDOMNET" data-toggle="tooltip" data-placement="bottom" >
                
                <WConnector>
                </WConnector>
              
            </div>
            </div>
          <Info />
          <div className="crashanimecontainer">  
<BrowserView>              
          <div className="myview"></div>
                <div className="contresultlot">
                  <div className=" resultlottext ">
                    VRF Score
                    </div>
              <CountUp className="resultlot"
              start={0}
              end={generatedValue}
              redraw={false}
              duration={animationDuration}
              separator=" "
              decimals={4}
              decimal="."
              prefix=""
              suffix=""
            ></CountUp>
                  </div>
              <div className="crashanime">
                <CrashAnimation  />
              </div>

                <div className="startgroup">
                <Bet />
                </div>
          </BrowserView>
            </div>
            <MobileView>
              
              <div className="resultlotmob">
            <CountUp
              start={0}
              end={generatedValue}
              redraw={false}
              duration={animationDuration}
              separator=" "
              decimals={3}
              decimal="."
              prefix=""
                suffix=""
                ></CountUp>
          </div>
              <div className="myviewmob"></div>
              <div className="crashanime">
                <CrashAnimation   />
              </div>

              <div className="startgroupmob">
                BROWSER & 
                RANDOMNET ONLY
                <Bet  />
            </div>
              </MobileView>
          </div>
          
        </div>

        
      </div>
      <div className="playerboard">
        <PlayerBoard /> 
        </div>

  
    </div>

    
  )
}

export default App
