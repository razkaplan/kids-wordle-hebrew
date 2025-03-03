// Modernized Hebrew Wordle for Kids
// Features: Load words from JSON, track stats in local storage, cleaner structure, icon-based category selection

class WordleGame {
    constructor() {
        this.wordLists = {};
        this.currentWord = "";
        this.currentRow = 0;
        this.currentTiles = [];
        this.isGameOver = false;
        this.stats = this.loadStats();
        this.init();
    }

    async init() {
        await this.loadWords();
        this.createGrid();
        this.createKeyboard();
        this.createCategoryIcons();
        this.resetGame();
        this.updateStatsDisplay();
    }

    async loadWords() {
        try {
            const response = await fetch("words.json");
            this.wordLists = await response.json();
        } catch (error) {
            console.error("Failed to load words.json", error);
        }
    }

    createGrid() {
        const grid = document.getElementById("grid");
        grid.innerHTML = "";
        for (let i = 0; i < 6; i++) {
            const row = document.createElement("div");
            row.className = "row";
            row.id = "row-" + i;
            for (let j = 0; j < 4; j++) {
                const tile = document.createElement("div");
                tile.className = "tile";
                tile.id = `tile-${i}-${j}`;
                row.appendChild(tile);
            }
            grid.appendChild(row);
        }
    }

    createKeyboard() {
        const keyboard = document.getElementById("keyboard");
        keyboard.innerHTML = "";
        const layout = [
            ["ק", "ר", "א", "ט", "ו", "ן", "ם", "פ"],
            ["ש", "ד", "ג", "כ", "ע", "י", "ח", "ל", "ך", "ף"],
            ["ז", "ס", "ב", "ה", "נ", "מ", "צ", "ת", "ץ"]
        ];

        layout.forEach(row => {
            const keyboardRow = document.createElement("div");
            keyboardRow.className = "keyboard-row";
            row.forEach(letter => {
                const key = document.createElement("button");
                key.className = "key";
                key.textContent = letter;
                key.onclick = () => this.addLetter(letter);
                keyboardRow.appendChild(key);
            });
            keyboard.appendChild(keyboardRow);
        });
    }

    createCategoryIcons() {
        const categories = [
            { name: "animals", icon: "🐶" },
            { name: "colors", icon: "🎨" },
            { name: "food", icon: "🍎" },
            { name: "objects", icon: "🔑" }
        ];
        const container = document.getElementById("category-container");
        container.innerHTML = "";

        categories.forEach(cat => {
            const button = document.createElement("button");
            button.className = "category-icon";
            button.innerHTML = cat.icon;
            button.onclick = () => this.resetGame(cat.name);
            container.appendChild(button);
        });
    }

    resetGame(category = "animals") {
        this.currentRow = 0;
        this.currentTiles = [];
        this.isGameOver = false;
        this.currentWord = this.getRandomWord(category);
        document.getElementById("message").textContent = "";
        this.clearGrid();
    }

    getRandomWord(category) {
        return this.wordLists[category]?.[Math.floor(Math.random() * this.wordLists[category].length)] || "";
    }

    checkGuess() {
        const guess = this.currentTiles.join("");
        if (guess === this.currentWord) {
            this.isGameOver = true;
            this.stats.wins++;
            document.getElementById("message").textContent = "ניצחת!";
            this.saveStats();
            return;
        }
        if (this.currentRow >= 5) {
            this.isGameOver = true;
            document.getElementById("message").textContent = "המילה הייתה: " + this.currentWord;
            this.stats.losses++;
            this.saveStats();
        } else {
            this.currentRow++;
            this.currentTiles = [];
        }
    }

    saveStats() {
        localStorage.setItem("wordleStats", JSON.stringify(this.stats));
        this.updateStatsDisplay();
    }

    loadStats() {
        return JSON.parse(localStorage.getItem("wordleStats")) || { wins: 0, losses: 0 };
    }

    updateStatsDisplay() {
        document.getElementById("stats").textContent = `ניצחונות: ${this.stats.wins} | הפסדים: ${this.stats.losses}`;
    }
}

document.addEventListener("DOMContentLoaded", () => new WordleGame());
