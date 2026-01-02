import express from 'express'
import dotenv from 'dotenv'
import { setupRoutes } from './endpoints.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

setupRoutes(app);

//Serwer
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;