import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from "@nestjs/core";
import {Role} from "./role.enum";
import {ROLES} from "./roles.decorator";

/**
 * Guard class for checking if user has valid rights to access specific method
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(
        context: ExecutionContext,
    ): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES, [
            context.getHandler(),
            context.getClass(),
        ]);
        if(!requiredRoles) return true;
        const request = context.switchToHttp().getRequest();
        return requiredRoles.some(role => request.user?.role === role);
    }
}
