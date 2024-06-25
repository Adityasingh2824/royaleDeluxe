import React, { FC } from 'react';

import {  gql, useSubscription,useQuery,useLazyQuery } from "@apollo/client";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";


import { useSelector, useDispatch } from "react-redux";

import {
  newEventVal,CustomerEvent, newHistoEventVal
} from "../../store";



const UPDATE_TABLE_SUBSCRIPTION = gql`
subscription MySubscription {
  events(
   where: {indexed_type: {_eq: "0xc4d40ddeab3a45bdd2621d980da2b56f9ac41ddf6f68058e2b800641e945c637::playdcrash::CrashEventU64"}}
    order_by: {transaction_version: desc}
    limit: 1
  )  {
    account_address
    event_index
    indexed_type
    data
    creation_number
    sequence_number
  }
}
`;
 

interface PlayerBoardProps {}

const PlayerBoard: FC<PlayerBoardProps> = () => {

  const lastEvent = useSelector((state: any) => state.clientReduxStore.lastEventVal);
  const lastEventArray = useSelector((state: any) => state.clientReduxStore.arrayLastEventVal);


  const SubscribeEvents = function () {
      
    const dispatch = useDispatch();

    const { loading_ws, error_ws, data_ws } = useSubscription(
      UPDATE_TABLE_SUBSCRIPTION,
      {
        //onSubscriptionData: (data) => {
        onData: (data) => {
          //console.log('onSubscriptionData EVENT FEED 3', data);
          if (data?.data) {
            //console.log('inData event got data', data.data.data.events[0].data);
            let myCustomerEvent: CustomerEvent = {};  
            
            myCustomerEvent.userName = "User-" + data.data.data.events[0].data.dude.slice(-6);
            myCustomerEvent.randresult = data.data.data.events[0].data.price;
            myCustomerEvent.winnings = (myCustomerEvent.randresult > data.data.data.events[0].data.target) ?               data.data.data.events[0].data.coinIAmt : -data.data.data.events[0].data.coinIAmt;
            console.log('inData will dispatch', myCustomerEvent);
            setTimeout(() => {
          //    dispatch(newEventVal(myCustomerEvent));   
              dispatch(newHistoEventVal(myCustomerEvent));   
            }, 4000);
            
            
          }
        },
      }
    );

  };


  SubscribeEvents();
   


  return(
    <div>
   
      <ul>
        {lastEventArray.slice(0,2).map((event: CustomerEvent, index: number) => {
          return (
            <li
              key={index}
            >
              {event.userName} {event.winnings} {event.randresult}
            </li>
          );
        }
        )}


      </ul>
      
    </div>
  )
};

export default PlayerBoard;
