package api

import (
	"encoding/json"
	"net/http"
)

func HandleTest(w http.ResponseWriter, r *http.Request) {
	resp := map[string]string{"message": "API is working!"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
