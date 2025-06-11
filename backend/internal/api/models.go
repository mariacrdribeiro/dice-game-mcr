package api

type RegisterRequest struct {
	ClientID string  `json:"clientId"`
	Balance  float64 `json:"balance"`
}
type BetRequest struct {
	ClientID string  `json:"clientId"`
	Amount   float64 `json:"amount"`
	BetType  string  `json:"betType"`
}

type BetResult struct {
	DiceNumber int    `json:"diceNumber"`
	Result     string `json:"result"`
}

type AddFundsRequest struct {
	ClientID string  `json:"clientId"`
	Amount   float64 `json:"amount"`
}

type Play struct {
	Amount  float64
	BetType string
	Active  bool
	Result  string
}

type Player struct {
	Balance float64
	Play    *Play
}
