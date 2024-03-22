import React from "react";
import { useSelector } from "react-redux";

function Info () {

  const userName = useSelector((state: any) => state.clientReduxStore.userName);
  const userBalance = useSelector((state: any) => state.clientReduxStore.balance);

const infoDialogBox = () => {
    alert("DEMO ONLY ON RANDOMNET  \n\
      Create a deposit account\n\
      Deposit APT tokens\n\
      You bet the Rocket will be 5 or higher.\n\
      Check the Outcome ( Pnl=(rand-5)/5; 0<=rand<9.9).\n\
      \
      Using APTOS vrf, thank you come again\n\
      ");
  }


  return (

    <div className="row">
      <div className="col-12 col-md-4">
        <div className="card-box info-box">
          <div className="info-emoji"> </div>
          
          <div className="info-data ">
            <div className="row">
          
              <button className="btninfo " onClick={() => infoDialogBox()}> &#9432; </button>
          
          <div className=" gamerule">    
            {"Winnings=(VRF Score-5)/5*Stake"}
            </div>
            </div>
            </div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card-box info-box">
          <div className="info-emoji"> &#128176;</div>
          <div className="info-data">{userBalance/100000000} APT</div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card-box info-box">
          <div className="info-emoji"></div>
          <div className="info-data">{}</div>
        </div>
      </div>
    </div>
  );
}

export default Info;
;//