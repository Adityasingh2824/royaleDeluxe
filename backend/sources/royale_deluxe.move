module royale_deluxe::play
{
    //use std::string;
    use std::signer;
    use aptos_std::smart_table;
    use aptos_std::math64;
    use std::signer::address_of;
    //use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::coin;

    const ERR_MARKET_ACCOUNT_EXISTS: u64 = 115;
    const ERR_NOT_ALLOWED: u64 = 200;
    const ERR_NOT_OWNER: u64 = 104;
    const ERR_NO_MARKET_ACCOUNT: u64 = 114;

/// The address of the market.
    struct MarketAccount has store {
        instrumentBalance: coin::Coin<0x1::aptos_coin::AptosCoin>,
        // Signer that created this market account.
        ownerAddress: address,
        // Counter for this account.
        orderCounter: u64,
        
    }

  // Each market account is uniquely described by a protocol and user address.
    struct MarketAccountKey has store, copy, drop {
        protocolAddress: address,
        userAddress: address,
    }

    // Struct encapsilating all info for a market.
    struct Casinobook has key, store {
        marketAccountsSmart: smart_table::SmartTable<MarketAccountKey, MarketAccount>,
    }

    struct Message has key
    {
        my_message : u64
    }

#[event]
    struct PriceEvent has store, drop {
        price: u64,
    }

    // create a new market with new Casinobook and market accounts
    //public entry fun init_market_entry(
    public entry fun init_market_entry(
        owner: &signer
    ) {
        let ownerAddr = address_of(owner);
        assert!(ownerAddr == @royale_deluxe, ERR_NOT_ALLOWED);
        move_to(owner, Casinobook{
            marketAccountsSmart: smart_table::new(),
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
            protocolAddress: @royale_deluxe,
            userAddress: userAddr,
        }
    }

    inline fun get_market_addr(): address  {
        @royale_deluxe
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
        });
    }

    public entry fun deposit_to_market_account_entry(
        owner: &signer,
        coinIAmt: u64,
        ) acquires  Casinobook {
        let accountKey = MarketAccountKey {
            protocolAddress: @royale_deluxe,
            userAddress: address_of(owner),
        };
        deposit_to_market_account(owner, accountKey, coinIAmt)
    }

    public entry fun withdraw_from_market_account_entry(
        owner: &signer,
        coinIAmt: u64, 
    ) acquires  Casinobook {
        let accountKey = MarketAccountKey {
            protocolAddress: @royale_deluxe,
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
            protocolAddress: @royale_deluxe,
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
        assert!(address_of(owner)==@royale_deluxe, ERR_NOT_OWNER);
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
            protocolAddress: @royale_deluxe,
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
    //    //     let ownerAddr = address_of(owner);
             let book = borrow_global_mut<Casinobook>(marketAddr);
    }


    struct MarketAccountView {
        instrumentBalanceSmart: u64, 
        smartTableLength: u64,
        coinDecimals:u8,
    }

#[view]
    public fun view_balance( user: address) : MarketAccountView acquires  Casinobook {
    

        let accountKey = MarketAccountKey {
            protocolAddress: @royale_deluxe,
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
        let message = borrow_global<Message>(@royale_deluxe);
        message.my_message
    }



}