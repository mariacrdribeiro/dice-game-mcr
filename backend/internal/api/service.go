package api

import (
	"errors"
	"math/rand"
	"sync"
	"time"
    "fmt"
)

var (
	mu      sync.Mutex
	players = make(map[string]*Player)
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

func RegisterPlayer(clientID string, balance int) error {
	mu.Lock()
	defer mu.Unlock()

	if _, exists := players[clientID]; exists {
		return errors.New("player already exists")
	}

	players[clientID] = &Player{
		Balance: balance,
		Play:    nil,
	}
	return nil
}



func GetBalance(clientID string) (int, error) {
	mu.Lock()
	defer mu.Unlock()

	player, exists := players[clientID]
	if !exists {
		return 0, errors.New("player not found")
	}

	return player.Balance, nil
}
func StartPlay(clientID string, amount int, betType string) (int, string, error) {
    mu.Lock()
    defer mu.Unlock()

    player, exists := players[clientID]
    if !exists {
        fmt.Printf("StartPlay: player %s not found\n", clientID)
        return 0, "", errors.New("player not found")
    }

    if player.Play != nil && player.Play.Active {
        fmt.Printf("StartPlay: player %s has an active play\n", clientID)
        return 0, "", errors.New("previous play still active")
    }

    if amount > player.Balance {
        fmt.Printf("StartPlay: player %s bet amount %d exceeds balance %d\n", clientID, amount, player.Balance)
        return 0, "", errors.New("bet amount exceeds balance")
    }

    dice := rand.Intn(6) + 1
    fmt.Printf("StartPlay: dice rolled %d\n", dice)

    result := "lose"
    if (dice%2 == 0 && betType == "even") || (dice%2 != 0 && betType == "odd") {
        result = "win"
    }
    fmt.Printf("StartPlay: result %s\n", result)

    player.Balance -= amount
    fmt.Printf("StartPlay: player %s new balance after betting %d is %d\n", clientID, amount, player.Balance)

    player.Play = &Play{
        Amount:  amount,
        BetType: betType,
        Active:  true,
        Result:  result,
    }

    return dice, result, nil
}

func EndPlay(clientID string) (int, string, error) {
    mu.Lock()
    defer mu.Unlock()

    player, exists := players[clientID]
    if !exists {
        fmt.Printf("EndPlay: player %s not found\n", clientID)
        return 0, "", errors.New("player not found")
    }

    if player.Play == nil || !player.Play.Active {
        fmt.Printf("EndPlay: player %s has no active play\n", clientID)
        return 0, "", errors.New("no active play to end")
    }

    result := player.Play.Result
    fmt.Printf("EndPlay: player %s play result is %s\n", clientID, result)

    if result == "win" {
        player.Balance += 2 * player.Play.Amount
        fmt.Printf("EndPlay: player %s won, new balance %d\n", clientID, player.Balance)
    } else {
        fmt.Printf("EndPlay: player %s lost, balance stays %d\n", clientID, player.Balance)
    }

    player.Play.Active = false
    player.Play = nil

    return player.Balance, result, nil
}

func AddFunds(clientID string, amount int) (int, error) {
	mu.Lock()
	defer mu.Unlock()

	player, exists := players[clientID]
	if !exists {
		return 0, errors.New("player not found")
	}

	if amount <= 0 {
		return player.Balance, errors.New("amount must be greater than 0")
	}

	player.Balance += amount
	return player.Balance, nil
}