import { Inject, NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserNode } from './users.entity';
import { UsersService } from './users.service';
import { UsersServiceErrors } from './users.service.errors';

@Resolver((of) => UserNode)
export class UsersResolver {
    constructor(@Inject('IUsersService') private service: UsersService) {}

    @Query((returns) => UserNode, { name: 'user' })
    // use ( 'id' , { type : () => Int } ) if id is supposed to be integer
    // make a funny query where we use @ArgsType() [ this would also need an extended UsersService]
    async getUser(@Args('id') id: string) {
        const user = await this.service.getUser(id);
        if (user === UsersServiceErrors.idNotFound) {
            throw new NotFoundException(user);
        } else {
            return user;
        }
    }
    @Query((returns) => [UserNode], { name: 'users' })
    // use ( 'id' , { type : () => Int } ) if id is supposed to be integer
    // make a funny query where we use @ArgsType() [ this would also need an extended UsersService]
    async getAllUser() {
        const users = await this.service.allUsers();
        return users;
    }
    @Mutation(() => String, { name: 'remove' })
    async removeUser(@Args('id') id: string) {
        const deletion = await this.service.delete(id);
        if (deletion === UsersServiceErrors.idNotFound) {
            throw new NotFoundException(deletion);
        }
        return 'success';
    }
}
