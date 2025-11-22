/// Game Logger Module for One Chain Casino
/// Logs all game results on-chain for transparency and verification
module game_logger::game_logger {
    use std::string::{Self, String};
    use sui::event;
    use sui::clock::{Self, Clock};

    /// Game types
    const GAME_TYPE_ROULETTE: u8 = 1;
    const GAME_TYPE_MINES: u8 = 2;
    const GAME_TYPE_PLINKO: u8 = 3;
    const GAME_TYPE_WHEEL: u8 = 4;

    /// Error codes
    const E_INVALID_GAME_TYPE: u64 = 1;
    const E_INVALID_AMOUNT: u64 = 2;
    const E_INVALID_PLAYER: u64 = 3;

    /// Game result event - emitted when a game is logged
    public struct GameResultEvent has copy, drop {
        game_id: address,
        game_type: u8,
        player_address: address,
        bet_amount: u64,
        payout_amount: u64,
        game_config: String,
        result_data: String,
        entropy_value: String,
        entropy_tx_hash: String,
        timestamp: u64,
    }

    /// Game result object stored on-chain
    public struct GameResult has key, store {
        id: UID,
        game_type: u8,
        player_address: address,
        bet_amount: u64,
        payout_amount: u64,
        game_config: String,
        result_data: String,
        entropy_value: String,
        entropy_tx_hash: String,
        timestamp: u64,
    }

    /// Log a roulette game result
    public entry fun log_roulette_game(
        player_address: address,
        bet_amount: u64,
        payout_amount: u64,
        game_config: vector<u8>,
        result_data: vector<u8>,
        entropy_value: vector<u8>,
        entropy_tx_hash: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        log_game_result(
            GAME_TYPE_ROULETTE,
            player_address,
            bet_amount,
            payout_amount,
            game_config,
            result_data,
            entropy_value,
            entropy_tx_hash,
            clock,
            ctx
        );
    }

    /// Log a mines game result
    public entry fun log_mines_game(
        player_address: address,
        bet_amount: u64,
        payout_amount: u64,
        game_config: vector<u8>,
        result_data: vector<u8>,
        entropy_value: vector<u8>,
        entropy_tx_hash: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        log_game_result(
            GAME_TYPE_MINES,
            player_address,
            bet_amount,
            payout_amount,
            game_config,
            result_data,
            entropy_value,
            entropy_tx_hash,
            clock,
            ctx
        );
    }

    /// Log a plinko game result
    public entry fun log_plinko_game(
        player_address: address,
        bet_amount: u64,
        payout_amount: u64,
        game_config: vector<u8>,
        result_data: vector<u8>,
        entropy_value: vector<u8>,
        entropy_tx_hash: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        log_game_result(
            GAME_TYPE_PLINKO,
            player_address,
            bet_amount,
            payout_amount,
            game_config,
            result_data,
            entropy_value,
            entropy_tx_hash,
            clock,
            ctx
        );
    }

    /// Log a wheel game result
    public entry fun log_wheel_game(
        player_address: address,
        bet_amount: u64,
        payout_amount: u64,
        game_config: vector<u8>,
        result_data: vector<u8>,
        entropy_value: vector<u8>,
        entropy_tx_hash: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        log_game_result(
            GAME_TYPE_WHEEL,
            player_address,
            bet_amount,
            payout_amount,
            game_config,
            result_data,
            entropy_value,
            entropy_tx_hash,
            clock,
            ctx
        );
    }

    /// Internal function to log game result
    fun log_game_result(
        game_type: u8,
        player_address: address,
        bet_amount: u64,
        payout_amount: u64,
        game_config: vector<u8>,
        result_data: vector<u8>,
        entropy_value: vector<u8>,
        entropy_tx_hash: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Validate inputs
        assert!(game_type >= GAME_TYPE_ROULETTE && game_type <= GAME_TYPE_WHEEL, E_INVALID_GAME_TYPE);
        assert!(bet_amount > 0, E_INVALID_AMOUNT);

        let timestamp = clock::timestamp_ms(clock);
        let game_id = ctx.sender();

        // Create game result object
        let game_result = GameResult {
            id: object::new(ctx),
            game_type,
            player_address,
            bet_amount,
            payout_amount,
            game_config: string::utf8(game_config),
            result_data: string::utf8(result_data),
            entropy_value: string::utf8(entropy_value),
            entropy_tx_hash: string::utf8(entropy_tx_hash),
            timestamp,
        };

        // Emit event for indexing
        event::emit(GameResultEvent {
            game_id,
            game_type,
            player_address,
            bet_amount,
            payout_amount,
            game_config: string::utf8(game_config),
            result_data: string::utf8(result_data),
            entropy_value: string::utf8(entropy_value),
            entropy_tx_hash: string::utf8(entropy_tx_hash),
            timestamp,
        });

        // Transfer game result to player for their records
        transfer::public_transfer(game_result, player_address);
    }

    /// Query function to get game result details
    public fun get_game_details(game_result: &GameResult): (
        u8,      // game_type
        address, // player_address
        u64,     // bet_amount
        u64,     // payout_amount
        String,  // game_config
        String,  // result_data
        String,  // entropy_value
        String,  // entropy_tx_hash
        u64      // timestamp
    ) {
        (
            game_result.game_type,
            game_result.player_address,
            game_result.bet_amount,
            game_result.payout_amount,
            game_result.game_config,
            game_result.result_data,
            game_result.entropy_value,
            game_result.entropy_tx_hash,
            game_result.timestamp
        )
    }
}
