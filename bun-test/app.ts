import express from "express"

const app = express()

app.get("/", (req, res) => {
  res.send("Hello, World!")
})

app.get("/square/:number", (req, res) => {
  const number = parseInt(req.params.number, 10)
    if (isNaN(number)) {
        return res.status(400).send("Invalid number")
    }
    const square = number * number
    res.json({ square })
})

app.listen(3000, () => {   
    console.log("Server is running on port 3000")
})


