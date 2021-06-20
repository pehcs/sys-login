const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookie())

const SECRET = "screto"

app.get("/", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!(email === "pehcorreias@gmail.com")) {
    res.status(400).json({ message: "Email invalid" });
  }
  if (!(password === "123")) {
    res.status(400).json({ message: "Password incorrect" });
  }

  const token = jwt.sign(email, SECRET, {
      expiresIn: 300
  })


  return res.status(200)
  .cookie("access_token", token)
  .json({ email, password, token });

});

function middleware(req,res,next){
    const token = req.cookies.access_token
    jwt.verify(token, SECRET, (err, decoded)=>{
        if(err){
            return res.status(401).json({ message: "Token expired or invalid"})
        }
        next()
    })
}

app.get("/conta", middleware, (req, res) => {
    res.json({ message: "its ok" });
});

app.listen(3000, () => {
  console.log("Server running in Localhost:3000");
});
