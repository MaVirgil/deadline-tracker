const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(`${__dirname}/public`));

app.get('/health', (req, res) => {
  res.send({
    data: "Ok"
  });
});

app.listen(PORT, (error) => {
  if (error) {
    console.log('An error occured: ', error);
    return;
  }

  console.log('App listening on port: ', PORT);
})