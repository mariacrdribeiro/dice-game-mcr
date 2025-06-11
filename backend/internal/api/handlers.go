package api

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

func HandleRegister(w http.ResponseWriter, r *http.Request) {

	var req RegisterRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "invalid request body"})
		return
	}

	if req.ClientID == "" || req.Balance < 0 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "invalid clientId or balance"})
		return
	}

	err := RegisterPlayer(req.ClientID, req.Balance)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": err.Error()})
		return
	}

	log.Printf("Received registration request: %+v\n", req)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "player registered"})
}
func HandleWallet(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	clientID := strings.TrimSpace(vars["clientId"])

	balance, err := GetBalance(clientID)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"message": err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]float64{"balance": balance})
}

func HandlePlay(w http.ResponseWriter, r *http.Request) {
	var betReq BetRequest
	if err := json.NewDecoder(r.Body).Decode(&betReq); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "invalid request body"})
		return
	}

	betReq.BetType = strings.ToLower(betReq.BetType)
	if betReq.BetType != "even" && betReq.BetType != "odd" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "betType must be 'even' or 'odd'"})
		return
	}

	dice, result, err := StartPlay(betReq.ClientID, betReq.Amount, betReq.BetType)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(BetResult{
		DiceNumber: dice,
		Result:     result,
	})
}

func HandleEndPlay(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	clientID := strings.TrimSpace(vars["clientId"])

	balance, result, err := EndPlay(clientID)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Play ended",
		"balance": balance,
		"result":  result,
	})
}

func HandleAddFunds(w http.ResponseWriter, r *http.Request) {

	var req AddFundsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "invalid request body"})
		return
	}

	newBalance, err := AddFunds(req.ClientID, req.Amount)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "funds added successfully",
		"balance": newBalance,
	})
}
func HandleLastRolls(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if len(lastResults) == 0 {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "No rolls recorded yet",
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(lastResults)
}
