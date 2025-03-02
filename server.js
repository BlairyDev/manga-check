const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

const app = express();

const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "public")));


app.use(cors());
app.use(express.json());

app.get("/api/releases", async (req, res) => {
    try{
        const response = await axios.get("https://api.mangaupdates.com/v1/releases/days");
        res.json(response.data);

    }catch{
        res.status(500).json({error: "Failed to fetch data"});
    }
})

app.post("/api/search", async (req, res) =>{
    try{

        const searchQuery = req.body.search;
        const pageQuery = req.body.page;
        const exclude_genreQuery = ["Adult", "Doujinshi", "Hentai"];

        console.log(searchQuery)

        let data = JSON.stringify({
            "search": searchQuery,
            "page": pageQuery,
            "exclude_genre": ["Doujinshi", "Hentai", "Adult", "Shounen Ai", "Yaoi", "Smut"]
        })

        console.log(exclude_genreQuery);

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.mangaupdates.com/v1/series/search',
            headers: { 
                'Content-Type': 'application/json'
            },

            data : data
        }

        const response = await axios.request(config);
        console.log(response.data);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({error: "Failed to fetch data"})
    }
})



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
})

app.listen(port, () => console.log(`Server running on port ${port}`))