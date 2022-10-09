const app = require('./src/app');

const port = process.env.PORT;
if (!port) {
  console.log('No port provided');
  return;
}

app.listen(port, () => console.log(`Server started! Port: http://localhost:${port}`));
