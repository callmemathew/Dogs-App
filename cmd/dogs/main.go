package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
)

type Dog struct {
	Number   int    `json:"number"`
	Breed    string `json:"breed"`
	Name     string `json:"name"`
	Photo    string `json:"photo"`
	Location string `json:"location"`
}

func main() {
	db, err := sql.Open("sqlite3", "dogs.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/api/dogs", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")

		limit, offset := paginate(r)

		dogs, err := fetchDogs(db, limit, offset)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		_ = json.NewEncoder(w).Encode(dogs)
	})

	http.Handle("/", http.FileServer(http.Dir("static")))

	log.Println("go to --> http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func fetchDogs(db *sql.DB, limit, offset int) ([]Dog, error) {
	rows, err := db.Query(
		fmt.Sprintf(`
			SELECT number, breed, name, photo, location
			FROM dogs
			ORDER BY id
			LIMIT %d OFFSET %d;`, limit, offset))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var dogs []Dog
	for rows.Next() {
		var d Dog
		if err := rows.Scan(&d.Number, &d.Breed, &d.Name, &d.Photo, &d.Location); err != nil {
			return nil, err
		}
		dogs = append(dogs, d)
	}
	return dogs, rows.Err()
}

func paginate(r *http.Request) (int, int) {
	q := r.URL.Query()

	page, _ := strconv.Atoi(q.Get("page"))
	if page <= 0 {
		page = 1
	}

	limit, _ := strconv.Atoi(q.Get("limit"))
	if limit <= 0 {
		limit = 5
	}

	offset := (page - 1) * limit

	return limit, offset

}
