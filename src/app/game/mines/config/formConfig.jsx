export const manualFormConfig = {
  fields: [
    {
      id: "betAmount",
      label: "mines_form.bet_amount_label",
      type: "singleSelect",
      options: [0.001, 0.01, 0.1, 1, 2, 5],
      defaultValue: 0.001,
      placeholder: "mines_form.bet_amount_placeholder",
    },
    {
      id: "mines",
      label: "mines_form.mines_count_label",
      type: "singleSelect",
      options: Array.from({ length: 24 }, (_, i) => i + 1),
      defaultValue: 5,
      placeholder: "mines_form.select_mines_count_placeholder",
    }
  ],
  submitButton: "mines_form.start_game",
};

export const autoFormConfig = {
  submitButton: "mines_form.start_auto_betting",
  fields: [
    {
      id: "betAmount",
      label: "mines_form.bet_amount_label",
      type: "singleSelect",
      options: [0.001, 0.01, 0.1, 1, 2, 5],
      defaultValue: 0.001,
      placeholder: "mines_form.bet_amount_placeholder",
    },
    {
      id: "mines",
      label: "mines_form.mines_count_label",
      type: "singleSelect",
      options: Array.from({ length: 24 }, (_, i) => i + 1),
      defaultValue: 5,
      placeholder: "mines_form.select_mines_count_placeholder",
    },
    {
      id: "tilesToReveal",
      label: "mines_form.tiles_to_reveal_label",
      type: "singleSelect",
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      defaultValue: 5,
      placeholder: "mines_form.tiles_to_reveal_placeholder",
    },
    {
      id: "numberOfBets",
      label: "mines_form.number_of_bets_label",
      type: "number",
      defaultValue: 10,
      placeholder: "mines_form.number_of_rounds_placeholder",
    },
    {
      id: "onWin",
      label: "mines_form.on_win_label",
      type: "singleSelect",
      options: [
        { value: "reset", label: "mines_form.reset_bet" },
        { value: "increase_10", label: "mines_form.increase_bet_by_10" },
        { value: "increase_25", label: "mines_form.increase_bet_by_25" },
        { value: "increase_50", label: "mines_form.increase_bet_by_50" },
        { value: "increase_100", label: "mines_form.increase_bet_by_100" },
      ],
      defaultValue: "reset",
      placeholder: "mines_form.on_win_placeholder",
    },
    {
      id: "onLoss",
      label: "mines_form.on_loss_label",
      type: "singleSelect",
      options: [
        { value: "reset", label: "mines_form.reset_bet" },
        { value: "increase_10", label: "mines_form.increase_bet_by_10" },
        { value: "increase_25", label: "mines_form.increase_bet_by_25" },
        { value: "increase_50", label: "mines_form.increase_bet_by_50" },
        { value: "increase_100", label: "mines_form.increase_bet_by_100" },
      ],
      defaultValue: "increase_50",
      placeholder: "mines_form.on_loss_placeholder",
    },
    {
      id: "stopOnProfit",
      label: "mines_form.stop_on_profit_label",
      type: "text",
      defaultValue: "0.1",
      placeholder: "mines_form.stop_on_profit_placeholder",
    },
    {
      id: "stopOnLoss",
      label: "mines_form.stop_on_loss_label",
      type: "text",
      defaultValue: "0.1",
      placeholder: "mines_form.stop_on_loss_placeholder",
    },
    {
      id: "aiAssist",
      label: "mines_form.ai_assist_label",
      type: "boolean", 
      defaultValue: false,
      placeholder: "mines_form.ai_assist_placeholder",
    }
  ],
};
