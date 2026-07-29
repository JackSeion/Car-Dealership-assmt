import app from './app';
import { config } from './config';

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});

export default server;
