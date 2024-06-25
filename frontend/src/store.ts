import { createSlice } from "@reduxjs/toolkit";

export interface CustomerEvent {
  userName: string;
  winnings: number;
  randresult: number;
}

export interface CustomerState {
  userName: string;
  balance: number;
  lastRandomVal: number;
  lastResultVal: number;
  animationVisible: boolean;
  animationDuration: number;
  isconnected: boolean;
  isMobile: boolean;
  lastEventVal: CustomerEvent | null;
  arrayLastEventVal: CustomerEvent[];

};

const initialState: CustomerState = {
  userName: "",
  balance: 0,
  lastRandomVal: 0,
  lastResultVal: 0,
  animationVisible: false,
  animationDuration: 4.2,
  isconnected: false,
  isMobile: false,
  lastEventVal: null,
  arrayLastEventVal: [],
  
};

export const clientReduxStore = createSlice({
  name: "clientReduxStore",
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.userName = action.payload;
    },

    newRandomVal: (state, action) => {
      state.lastRandomVal = action.payload;
      
    },

    newResultVal: (state, action) => {
      state.lastResultVal = action.payload;
   
    },

    newEventVal: (state, action) => {
      state.lastEventVal = action.payload;
    
    },
    
    newHistoEventVal: (state, action) => { 
      state.arrayLastEventVal = [action.payload, ...state.arrayLastEventVal];
    },

    setAnimationVal: (state, action) => {
      state.animationVisible = action.payload;
    },

    updateBalanceVal: (state, action) => {
      state.balance = action.payload;
    },

    setConnectedVal: (state, action) => {
      state.isconnected = action.payload;
    },

    setMobileVal: (state, action) => {
      state.isMobile = action.payload;
    }

  },
});

export const {
  CustomerEvent,
  setUserName,
  newRandomVal,
  newResultVal,
  newEventVal,
  newHistoEventVal,
  setAnimationVal,
  updateBalanceVal,
  setConnectedVal,
  setMobileVal
} = clientReduxStore.actions;

export default clientReduxStore.reducer;
