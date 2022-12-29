import express from 'express';
import morgan from 'morgan';
import routes from '../routes';
import error from '../handlers/error';
import './app.d';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(error.init);

app.use(routes.main);
app.use(routes.auth);
app.use(error.handle);

export default app;
