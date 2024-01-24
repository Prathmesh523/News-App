import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import NewsAPI from 'newsapi'

dotenv.config()
const PORT = process.env.PORT
const API_KEY = process.env.API_KEY

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.post("/", async (req, res) => {
    const category = req.body
    const newsapi = new NewsAPI('d6a1c3c4df3b40a0b2a31d9acc5955d9');
    const data = await newsapi.v2.topHeadlines({
        category: category,
        language: 'en',
    })
    return res.json({data:data})
})

app.listen(PORT, () => {
    console.log("Server is running")
})