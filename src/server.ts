import * as Koa from 'koa';

const app = new Koa();

app.use( async (ctx: any) => {
	ctx.body = 'Hello';
});

app.listen(8000);
