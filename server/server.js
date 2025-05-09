const dotenv = require('dotenv');
dotenv.config({path: './config.env'})

const dbconfig = require('./config/dbconfig');

const server = require('./app');

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server Running on port: ${PORT}`);
});

