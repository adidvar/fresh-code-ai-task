const cors = require("cors");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

// Ініціалізація сервера
const app = express();
const PORT = 2121;

app.use(cors());

// Middleware для роботи з JSON
app.use(bodyParser.json());

// Підключення до бази SQLite
const db = new sqlite3.Database("./todo.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Створення таблиці, якщо вона ще не існує
db.run(
  `CREATE TABLE IF NOT EXISTS todo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    color TEXT NOT NULL,
    group_name TEXT CHECK(group_name IN ('планується', 'виконується', 'виконано')) NOT NULL,
    order_index INTEGER DEFAULT 0
  )`,
  (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
    } else {
      console.log('Table "todo" is ready.');
    }
  },
);

// 1. Додати новий елемент до списку
app.post("/todos", (req, res) => {
  const { text, color, group_name, order_index } = req.body;

  if (!text || !color || !group_name) {
    return res
      .status(400)
      .json({ error: "Fields required: text, color, group_name." });
  }

  const query = `INSERT INTO todo (text, color, group_name, order_index) VALUES (?, ?, ?, ?)`;
  db.run(query, [text, color, group_name, order_index || 0], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res
      .status(201)
      .json({ id: this.lastID, message: "Todo item created successfully." });
  });
});

// 2. Оновити елемент у списку
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { text, color, group_name, order_index } = req.body;

  if (!text || !color || !group_name) {
    return res
      .status(400)
      .json({ error: "Fields required: text, color, group_name." });
  }

  const query = `UPDATE todo SET text = ?, color = ?, group_name = ?, order_index = ? WHERE id = ?`;
  db.run(
    query,
    [text, color, group_name, order_index || 0, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Todo item not found." });
      }
      res.json({ message: "Todo item updated successfully." });
    },
  );
});

// 3. Видалити елемент із списку
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM todo WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Todo item not found." });
    }
    res.json({ message: "Todo item deleted successfully." });
  });
});

// Отримати всі елементи (додатково)
app.get("/todos", (req, res) => {
  const query = `SELECT * FROM todo ORDER BY order_index ASC`;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
