const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

function generateId(todos) {
    return todos.length ? todos[todos.length - 1].id + 1 : 1;
}

app.get('/', (req, res) => {
    fs.readFile('todo.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(404).json({ message: "File not found" });
        }
        res.json(JSON.parse(data));
    });
});

app.post('/', (req, res) => {
    const { name, todo } = req.body;

    fs.readFile('todo.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error reading file" });
        }

        try {
            const content = JSON.parse(data);
            const newId = generateId(content);
            const newData = { id: newId, name, todo, status: "not done" };

            content.push(newData);

            fs.writeFile('todo.json', JSON.stringify(content, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ message: "Error writing to file" });
                }
                res.status(201).json({ message: 'Todo successfully added!', newTodo: newData });
            });
        } catch (err) {
            res.status(500).json({ message: "Error parsing data" });
        }
    });
});

app.put('/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    fs.readFile('todo.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error reading file" });
        }

        try {
            const content = JSON.parse(data);
            const todo = content.find(todo => todo.id === parseInt(id));

            if (!todo) {
                return res.status(404).json({ message: "Todo not found" });
            }

            todo.status = status || todo.status;

            fs.writeFile('todo.json', JSON.stringify(content, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ message: "Error writing to file" });
                }
                res.status(200).json({ message: 'Todo status updated!', updatedTodo: todo });
            });
        } catch (err) {
            res.status(500).json({ message: "Error parsing data" });
        }
    });
});

app.delete('/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile('todo.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error reading file" });
        }

        try {
            const content = JSON.parse(data);
            const filteredContent = content.filter(todo => todo.id !== parseInt(id));

            if (filteredContent.length === content.length) {
                return res.status(404).json({ message: "Todo not found" });
            }

            fs.writeFile('todo.json', JSON.stringify(filteredContent, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ message: "Error writing to file" });
                }
                res.status(200).json({ message: 'Todo successfully deleted!' });
            });
        } catch (err) {
            res.status(500).json({ message: "Error parsing data" });
        }
    });
});

function callback() {
    console.log(`Server is running on port 3000 http://localhost:3000`);
}

app.listen(3000, callback);
