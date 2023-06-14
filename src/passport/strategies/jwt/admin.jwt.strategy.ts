import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminService } from 'src/apis/admin/services/admin.service';
import { StrategyKey } from 'src/common/constant';
import { JwtPayload } from 'src/jwt/jwt.interface';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, StrategyKey.JWT.ADMIN) {
	constructor(
		private readonly redisService: RedisService,
		private readonly adminService: AdminService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.SECRET_JWT
		});
	}

	async validate(payload: JwtPayload) {
		const { id } = payload;
		const where = { id };
		await this.redisService.getAccessToken(id);
		return this.adminService.getOneOrFail(where);
	}
}
