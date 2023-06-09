import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { useSwagger } from './app/app.swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		snapshot: true
	});

	app.setGlobalPrefix('api');
	app.enableCors({
		origin: '*'
	});
	app.use(cookieParser());
	useSwagger(app);

	const port = process.env.PORT || 3000;
	await app.listen(port);
}
bootstrap();
