const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.get('/health', (req, res) => {
  res.send({
    data: "Ok"
  });
});

// app.get('/', (req, res) => {
//   res.sendFile(`${__dirname}/static/html/index.html`);
// })

app.listen(PORT, (error) => {
  if (error) {
    console.log('An error occured: ', error);
    return;
  }

  console.log('App listening on port: ', PORT);
})