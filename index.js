import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "AuthenticationLevel1",
  password: "ChibaKing82",
  port: 5432,
});
db.connect();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) =>
  {
    console.log(req.body.username, req.body.password);

      const email= req.body.username;
      const password = req.body.password;


    try
    {

        if(await checkUserExists(email))
        {
          res.send("Email already exists. Try logging in.");  
        }
        else
        {
        await db.query('INSERT INTO users(email, password) VALUES($1, $2)', [email, password]);
          res.render("home.ejs");
        }
    }
    catch (err)
    {
      console.log(err);
    }   
  });

app.post("/login", async (req, res) => {
   console.log(req.body.username, req.body.password);

      const email= req.body.username;
      const password = req.body.password;


    try
    {
      const result = await db.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password]);
    

      if(result.rows.length > 0)
      {
        res.render("secrets.ejs");
      }
      else
      {
        res.send("Invalid email or password.");
      }
    }
    catch (err)
    {
      console.log(err);
    }   
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


const checkUserExists = async (email) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows.length > 0;
  } catch (err) {
    console.log(err);
    return false;
  }
};
