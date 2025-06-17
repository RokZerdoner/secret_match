import {Role} from "./role.enum";
import {SetMetadata} from "@nestjs/common";

export const ROLES = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES, roles)