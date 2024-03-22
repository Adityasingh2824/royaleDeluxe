module royaledeluxe1::playdcrash
{
    //use std::string;
    use std::signer;
    use aptos_std::smart_table;
    use aptos_std::math64;
    use std::signer::address_of;
    //use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::coin;
   use aptos_framework::account;
   use aptos_framework::randomness;

    const ERR_MARKET_ACCOUNT_EXISTS: u64 = 115;
    const ERR_NOT_ALLOWED: u64 = 200;
    const ERR_NOT_OWNER: u64 = 104;
    const ERR_NO_MARKET_ACCOUNT: u64 = 114;
    const ERR_CUSTOMER_NOT_ENOUGH_FUNDS: u64 = 116;
    const ERR_CASINO_NOT_ENOUGH_FUNDS: u64 = 117;

/// The address of the market.
    struct MarketAccount has store {
        instrumentBalance: coin::Coin<0x1::aptos_coin::AptosCoin>,
        // Signer that created this market account.
        ownerAddress: address,
        // Counter for this account.
        orderCounter: u64,
        lastTarget:u64,
        lastPrice:u64,
        lastAmount:u64,        
    }

  // Each market account is uniquely described by a protocol and user address.
    struct MarketAccountKey has store, copy, drop {
        protocolAddress: address,
        userAddress: address,
    }

    // Struct encapsulating all info for a market.
    struct Casinobook has key, store {
        marketAccountsSmart: smart_table::SmartTable<MarketAccountKey, MarketAccount>,
        casinoBalance: coin::Coin<0x1::aptos_coin::AptosCoin>,
    }

    struct Message has key
    {
        my_message : u64
    }

#[event]
    struct PriceEvent has store, drop {
        price: u64,
    }

    #[event]
    struct CrashEventU8 has store, drop {
        target: u8,
        stake: u64,
        price: u8,
        coinIAmt: u64,
        dude: address,
    }

    #[event]
    struct CrashEventU64 has store, drop {
        target: u64,
        stake: u64,
        price: u64,
        coinIAmt: u64,
        dude: address,
    }

    // create a new market with new Casinobook and market accounts
    //public entry fun init_market_entry(
    public entry fun init_market_entry(
        owner: &signer
    ) {
        let ownerAddr = address_of(owner);
        assert!(ownerAddr == @royaledeluxe1, ERR_NOT_ALLOWED);
        move_to(owner, Casinobook{
            marketAccountsSmart: smart_table::new(),  casinoBalance: coin::zero()
        });
    }

    public entry fun open_customer_account_entry(
    
        owner: &signer
    ) acquires  Casinobook {
        open_customer_account(owner, get_casino_market_account_key(owner));
    }

    public fun get_casino_market_account_key(
        user: &signer,
    ): MarketAccountKey {
        let userAddr = address_of(user);
        MarketAccountKey {
            protocolAddress: @royaledeluxe1,
            userAddress: userAddr,
        }
    }

    inline fun get_market_addr(): address  {
        @royaledeluxe1
    }

    public fun open_customer_account(
        owner: &signer,
        mak: MarketAccountKey,
    ) acquires  Casinobook {
        let ownerAddr = address_of(owner);
        let marketAddr = get_market_addr();
        let book = borrow_global_mut<Casinobook>(marketAddr);
        assert!(!smart_table::contains(&book.marketAccountsSmart, mak), ERR_MARKET_ACCOUNT_EXISTS);
        smart_table::add(&mut book.marketAccountsSmart, mak, MarketAccount{
            instrumentBalance: coin::zero(),
            ownerAddress: ownerAddr,
            orderCounter: 0,
            lastTarget:0,
            lastPrice:0,
            lastAmount:0,   
        });
    }

    public entry fun deposit_to_market_account_entry(
        owner: &signer,
        coinIAmt: u64,
        ) acquires  Casinobook {
        let accountKey = MarketAccountKey {
            protocolAddress: @royaledeluxe1,
            userAddress: address_of(owner),
        };
        deposit_to_market_account(owner, accountKey, coinIAmt)
    }

    public entry fun withdraw_from_market_account_entry(
        owner: &signer,
        coinIAmt: u64, 
    ) acquires  Casinobook {
        let accountKey = MarketAccountKey {
            protocolAddress: @royaledeluxe1,
            userAddress: address_of(owner),
        };
        withdraw_from_market_account(owner, accountKey, coinIAmt)
    }

public fun deposit_to_market_account(
        owner: &signer,
        accountKey: MarketAccountKey,
        coinIAmt: u64, 
    ) acquires  Casinobook {
        let marketAddr = get_market_addr();
        let book = borrow_global_mut<Casinobook>(marketAddr);
        {
        assert!(smart_table::contains(&book.marketAccountsSmart, accountKey), ERR_NO_MARKET_ACCOUNT);
        let marketAcc = smart_table::borrow_mut(&mut book.marketAccountsSmart, accountKey);
        assert!(owns_account(owner, &accountKey, marketAcc), ERR_NOT_OWNER);
        if (coinIAmt > 0) {
            let coinAmt = coin::withdraw<0x1::aptos_coin::AptosCoin>(owner, coinIAmt);
            coin::merge(&mut marketAcc.instrumentBalance, coinAmt);
        };
        };
    }
    
    fun owns_account(
        owner: &signer,
        accountKey: &MarketAccountKey,
        marketAccount: &MarketAccount,
    ): bool {
        let ownerAddr = address_of(owner);
        ownerAddr == marketAccount.ownerAddress || ownerAddr == accountKey.protocolAddress
    }

    public fun withdraw_from_market_account(
        owner: &signer,
        accountKey: MarketAccountKey,
        coinIAmt: u64, 
    ) acquires  Casinobook {
        let marketAddr = get_market_addr();
        let ownerAddr = address_of(owner);
        let book = borrow_global_mut<Casinobook>(marketAddr);
        assert!(smart_table::contains(&book.marketAccountsSmart, accountKey), ERR_NO_MARKET_ACCOUNT);
        {
            let marketAcc = smart_table::borrow_mut(&mut book.marketAccountsSmart, accountKey);
            let coinWithAmt = math64::min(coinIAmt, coin::value(&marketAcc.instrumentBalance));
            assert!(owns_account(owner, &accountKey, marketAcc), ERR_NOT_OWNER);
            if (coinWithAmt > 0) {
                let coinAmt = coin::extract<0x1::aptos_coin::AptosCoin>(
                    &mut marketAcc.instrumentBalance,
                          coinWithAmt,
                );
                coin::deposit(ownerAddr, coinAmt);
            };
        };
    }

public entry  fun  send_reset_account_entry(
    owner: &signer,
    ) acquires  Casinobook {
        let accountKey = MarketAccountKey {
            protocolAddress: @royaledeluxe1,
            userAddress: address_of(owner),
        };
        send_reset_account(owner,accountKey)
    }

public fun  send_reset_account(  
        owner: &signer,
        accountKey: MarketAccountKey,
        )  acquires Casinobook
        {
            let marketAddr = get_market_addr();
            let book = borrow_global_mut<Casinobook>(marketAddr);
            {
                assert!(smart_table::contains(&book.marketAccountsSmart, accountKey), ERR_NO_MARKET_ACCOUNT);
                let marketAcc = smart_table::borrow_mut(&mut book.marketAccountsSmart, accountKey);
                assert!(owns_account(owner, &accountKey, marketAcc), ERR_NOT_OWNER);
            };
        }

    public entry  fun  send_reset_all_entry(
     owner: &signer,
       
    ) acquires  Casinobook {
        assert!(address_of(owner)==@royaledeluxe1, ERR_NOT_OWNER);
        send_reset_all();
    }

public fun  send_reset_all(   
        
        )  acquires Casinobook
        {
            let marketAddr = get_market_addr();
            let book = borrow_global_mut<Casinobook>(marketAddr);
            smart_table::for_each_mut(&mut book.marketAccountsSmart, | _k, lmarketAccount | {
            let lmarketAccount: &mut MarketAccount = lmarketAccount;
      });
    }

    public entry fun send_order_entry(
        owner: &signer,
        leverage: u64, 
        cont: u64, 
        side: bool,
      ) acquires  Casinobook {
        let accountKey = MarketAccountKey {
            protocolAddress: @royaledeluxe1,
            userAddress: address_of(owner),
        };
        send_order(owner, accountKey,leverage, cont,side)
    }

    public fun  send_order(
        owner: &signer,
        accountKey: MarketAccountKey,
        leverage: u64,
        cont: u64, // Fixe
        sideLong: bool,
        )  acquires Casinobook
        {
             let marketAddr = get_market_addr();
       //     let ownerAddr = address_of(owner);
             let book = borrow_global_mut<Casinobook>(marketAddr);
    }

   

    fun enough_funds_account(
        owner: &signer,
        accountKey: &MarketAccountKey,
        stake: u64,
    ): bool acquires  Casinobook  {
        let canBet=false;
           let marketAddr = get_market_addr();
     //   let ownerAddr = address_of(owner);
        let book = borrow_global_mut<Casinobook>(marketAddr);
           let marketAcc = smart_table::borrow_mut(&mut book.marketAccountsSmart, *accountKey);
        coin::value(&marketAcc.instrumentBalance) >= stake
    }





      entry fun royale_crash(
        player: &signer,
        stake: u64, 
        target: u64, 
        side: bool,
      ) acquires  Casinobook {
        let accountKey = MarketAccountKey {
            protocolAddress: @royaledeluxe1,
            userAddress: address_of(player),
        };
        // todo a assert test enough funds both sides :)
        assert!(enough_funds_account(player, &accountKey,stake), ERR_CUSTOMER_NOT_ENOUGH_FUNDS);
        crash(player, accountKey,stake, target,side)

    }

     fun crash(
        player: &signer,
        accountKey: MarketAccountKey,
        stake: u64, 
        target: u64, 
        side: bool,
      ) acquires  Casinobook {
        let marketAddr = get_market_addr();
       //     let ownerAddr = address_of(owner);
        let book = borrow_global_mut<Casinobook>(marketAddr);
        assert!(smart_table::contains(&book.marketAccountsSmart, accountKey), ERR_NO_MARKET_ACCOUNT);
        
        // let marketAcc = smart_table::borrow_mut(&mut book.marketAccountsSmart, accountKey);


        // assert!(owns_account(player, &accountKey, marketAcc), ERR_NOT_OWNER);

        // let coinAmt = coin::extract<0x1::aptos_coin::AptosCoin>(
        //                     &mut marketAcc.instrumentBalance,
        //                     amount,
        //                 );
        //  coin::merge( &mut marketAcc.marginBalance, coinAmt);
      
//on est sympa oon lui file de la tune

target=5000000;
let myCasinoAccountKey = MarketAccountKey {
            protocolAddress: @royaledeluxe1,
            userAddress: @royaledeluxe1,
};
let price= randomness::u64_range(0,10000000); 


let outcome :u64= 0;
if (price>target){
    outcome= ((price-target)*stake)/target; 
    //outcome= stake/2;

    let casinoAccount = smart_table::borrow_mut(&mut book.marketAccountsSmart, myCasinoAccountKey);
    let coinAmt = coin::extract<0x1::aptos_coin::AptosCoin>( &mut casinoAccount.instrumentBalance,outcome);
    let marketAcc = smart_table::borrow_mut(&mut book.marketAccountsSmart, accountKey);
    coin::merge(&mut marketAcc.instrumentBalance, coinAmt);
}else{
    outcome= ((target-price)*stake)/target; 
    //outcome= stake/2;
    let marketAcc = smart_table::borrow_mut(&mut book.marketAccountsSmart, accountKey);
    let coinAmt = coin::extract<0x1::aptos_coin::AptosCoin>( &mut marketAcc.instrumentBalance, outcome);
    let casinoAccount = smart_table::borrow_mut(&mut book.marketAccountsSmart, myCasinoAccountKey);
    coin::merge(&mut casinoAccount.instrumentBalance, coinAmt);
};

    // let casinoAccount = smart_table::borrow_mut(&mut book.marketAccountsSmart, myCasinoAccountKey);
    // let outcome= randomness::u64_range(0,10)*1000000; 
    // let price= randomness::u64_range(0,10000000);
    // let coinAmt = coin::extract<0x1::aptos_coin::AptosCoin>( &mut casinoAccount.instrumentBalance,outcome   );
    // let marketAcc = smart_table::borrow_mut(&mut book.marketAccountsSmart, accountKey);
    // coin::merge(&mut marketAcc.instrumentBalance, coinAmt);
    let marketAcc = smart_table::borrow_mut(&mut book.marketAccountsSmart, accountKey);
        marketAcc.lastTarget=target;
        marketAcc.lastPrice= price;
        marketAcc.lastAmount= outcome;

    let event =CrashEventU64{
        target: target,
        stake: stake,
        price: price,
        coinIAmt: outcome,
        dude: address_of(player),
    };
           
        // Emit the event just defined.
        event::emit(event)
      }

    struct MarketAccountView {
        instrumentBalanceSmart: u64, 
        smartTableLength: u64,
        coinDecimals:u8,
    }


//   struct CrashEventU64 has store, drop {
//         target: u64,
//         stake: u64,
//         price: u64,
//         coinIAmt: u64,
//         dude: address,
//     }



    struct ResultAccountView {
        dude: address,
        instrumentBalanceSmart: u64, 
        randResult: u64,
        target:u64,
        payment: u64,
    }

#[view]
    public fun view_balance( user: address) : MarketAccountView acquires  Casinobook {
        let accountKey = MarketAccountKey {
            protocolAddress: @royaledeluxe1,
            userAddress: user,
        };
        let marketAddr = get_market_addr();
        let book = borrow_global<Casinobook>(marketAddr);
        let marketAccountsSmart = smart_table::borrow(&book.marketAccountsSmart, accountKey);
        let coinIDecimals = coin::decimals<0x1::aptos_coin::AptosCoin>();

        MarketAccountView {
            instrumentBalanceSmart: coin::value(&marketAccountsSmart.instrumentBalance),
            smartTableLength: smart_table::length(&book.marketAccountsSmart),
            coinDecimals: coinIDecimals,
        }
    }

#[view]
    public fun view_index() : u64 acquires Message{
        let message = borrow_global<Message>(@royaledeluxe1);
        message.my_message
    }

#[view]
    public fun view_result( user: address) : ResultAccountView acquires Casinobook {
        let accountKey = MarketAccountKey {
            protocolAddress: @royaledeluxe1,
            userAddress: user,
        };
        let marketAddr = get_market_addr();
        let book = borrow_global<Casinobook>(marketAddr);
        let marketAccountsSmart = smart_table::borrow(&book.marketAccountsSmart, accountKey);
        
        ResultAccountView {
            dude: user,
            instrumentBalanceSmart:coin::value(&marketAccountsSmart.instrumentBalance),
            randResult: marketAccountsSmart.lastPrice ,
            target:marketAccountsSmart.lastTarget,
            payment: marketAccountsSmart.lastAmount,
        } 

    }

}