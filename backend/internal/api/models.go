package api

type BetRequest struct {
	ClientID string `json:"clientId"`
	Amount   int    `json:"amount"`
	BetType  string `json:"betType"`
}

type BetResult struct {
	DiceNumber int    `json:"diceNumber"`
	Result     string `json:"result"` 
}

type AddFundsRequest struct {
	ClientID string `json:"clientId"`
	Amount   int    `json:"amount"`
}

type Play struct {
    Amount  int
    BetType string
    Active  bool
	Result  string
}

type Player struct {
    Balance int
    Play    *Play
}

