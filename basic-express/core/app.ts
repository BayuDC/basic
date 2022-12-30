import express from 'express';
import cookie from 'cookie-parser';
import morgan from 'morgan';
import routes from '../routes';
import error from '../handlers/error';
import auth from '../handlers/auth';
import './app.shit';

const app = express();

app.set('secret', process.env.JWT_SECRET);

app.use(morgan('dev'));
app.use(express.json());
app.use(cookie());
app.use(auth.load);
app.use(error.init);

app.use(routes.main);
app.use(routes.auth);
app.use(routes.user);
app.use(error.handle);

export default app;
