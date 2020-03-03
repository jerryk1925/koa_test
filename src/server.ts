import 'reflect-metadata';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as passport from 'koa-passport';
import * as session from 'koa-session';

import './auth/auth';
import db from './db/db';
import routes from './routes/routes';

const PORT = 8000;

const koa = new Koa();

// koa-bodyparser
koa.use(bodyParser());

// koa-session
koa.keys = ['hurf durf'];
koa.use(session({}, koa));

// koa-passport
koa.use(passport.initialize());
koa.use(passport.session());

koa.use(routes.routes());
koa.listen(PORT);

db.connect()
.then(() => console.log('Postgres connected'))
.catch((error) => console.log('Failed to connect to postgres', error));
