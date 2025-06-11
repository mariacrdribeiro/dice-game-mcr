package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/mariacrdribeiro/dice-game-mcr/backend/internal/api" 
)

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/api/test", api.HandleTest).Methods("GET")

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
