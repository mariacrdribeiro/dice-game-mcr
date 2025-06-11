package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/mariacrdribeiro/dice-game-mcr/backend/internal/api"
	"github.com/rs/cors"
)

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/register", api.HandleRegister).Methods("POST")
	r.HandleFunc("/wallet/{clientId}", api.HandleWallet).Methods("GET")
	r.HandleFunc("/play", api.HandlePlay).Methods("POST")
	r.HandleFunc("/endplay/{clientId}", api.HandleEndPlay).Methods("POST")
	r.HandleFunc("/wallet/add", api.HandleAddFunds).Methods("POST")
	r.HandleFunc("/play/last-results", api.HandleLastRolls).Methods("GET")

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type"},
	})

	handler := c.Handler(r)

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
