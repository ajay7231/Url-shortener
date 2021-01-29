const express = require("express");
const mongoose = require("mongoose");
const shortUrl = require("./models/shortUrl");

const app = express();
//local db connection
mongoose.connect("mongodb://localhost/urlShortner", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

//ejs view engine
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));



app.get("/", async (req, res) => {
  const shortUrls = await shortUrl.find()
  res.render("index",{shortUrls:shortUrls});
});

app.post("/shortUrls", async (req, res) => {
  await shortUrl.create({
    full: req.body.fullUrl,
  });
  res.redirect("/");
});

//redirecting to full url

app.get('/:shortUrl',async (req,res)=>{
    const shorturl = await shortUrl.findOne({short:req.params.shortUrl})
    if(shorturl == null) return res.sendStatus(404)
    
    shorturl.clicks++;
    shorturl.save()

    res.redirect(shorturl.full)
})

app.listen(process.env.PORT || 5000);
console.log("Listenng on port...");
