
import * as Router from 'koa-router';
import * as bcrypt from 'bcryptjs';
import * as Joi from 'joi';
import * as passport from 'koa-passport';
import { getRepository } from 'typeorm';

import { User } from '../entity/user';

const routes = new Router();

routes
	.use('/api/*', async (ctx: any, next: any) => {
		if (ctx.isUnauthenticated()) {
			// logger.info('is not auth');
			ctx.redirect('/');
		}
		
		return next();
	})
	
	.get('/', async (ctx: any) => {
		ctx.body = 'you must login';
	})
	
	.post('/login', async (ctx: any, next: any) =>
		passport.authenticate('local', {
			successRedirect: '/api/users',
			failureRedirect: '/'
		})(ctx, next)
	)
	
	.get('/logout', async (ctx: any, next: any) => {
		if (ctx.isAuthenticated()) {
			ctx.logout();
			ctx.session = null;
		}
		
		ctx.redirect('/');
	})
	
	.get('/register', async (ctx: any) => {
		ctx.body = 'register';
	})
	
	.post('/register', async (ctx: any, next: any) => {
		const body = ctx.request.body;
		const schema = Joi.object().keys({
			username: Joi.string(),
			password: Joi.string(),
			firstName: Joi.string(),
			lastName: Joi.string()
		});
		
		const result = Joi.validate(body, schema);
		if (result.error) {
			// logger.error(JSON.stringify(result.error));
			ctx.throw(400, result.error.message);
		}
		
		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(body.password, salt);
		let userEntity = new User();
		Object.assign(userEntity, body, { password: hash });
		
		userEntity = await getRepository(User).save(userEntity);
		
		return passport.authenticate('local', {
			successRedirect: '/api/users',
			failureRedirect: '/'
		})(ctx, next);
	})
	
	.get('/api/users', async (ctx: any) => {
		ctx.body = await User.find();
	});

export default routes;
