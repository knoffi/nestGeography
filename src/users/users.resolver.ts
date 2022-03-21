import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserNode } from './users.entity';
import { CreateUserInput, UpdateUserInput } from './users.input';
import { UsersService } from './users.service';
import { UsersServiceErrors } from './users.service.errors';
@Resolver((of) => UserNode)
export class UsersResolver {
    constructor(@Inject('IUsersService') private service: UsersService) {}

    @Query((returns) => UserNode, { name: 'user' })
    // use ( 'id' , { type : () => Int } ) if id is supposed to be integer
    async getUser(@Args('id') id: string): Promise<UserNode> {
        const user = await this.service.getUser(id);
        if (user === UsersServiceErrors.idNotFound) {
            throw new NotFoundException(user);
        } else {
            return user;
        }
    }
    @Query((returns) => [UserNode], { name: 'users' })
    async getAllUser(): Promise<UserNode[]> {
        const users = await this.service.allUsers();
        return users;
    }
    @Mutation(() => String, { name: 'remove' })
    async removeUser(@Args('id') id: string): Promise<'success'> {
        const deletion = await this.service.delete(id);
        if (deletion === UsersServiceErrors.idNotFound) {
            throw new NotFoundException(deletion);
        }
        return 'success';
    }

    @Mutation(() => UserNode, { name: 'create' })
    async createUser(
        @Args('newUser') newUser: CreateUserInput
    ): Promise<UserNode> {
        const creation = await this.service.create(newUser);
        if (creation === UsersServiceErrors.doubleEmail) {
            throw new BadRequestException(creation);
        }
        return creation;
    }
    @Mutation(() => UserNode, { name: 'update' })
    async updateUser(
        @Args('id') id: string,
        @Args('updates') updates: UpdateUserInput
    ): Promise<UserNode> {
        const update = await this.service.update(id, updates);
        switch (update) {
            case UsersServiceErrors.doubleEmail:
                throw new BadRequestException(update);
            case UsersServiceErrors.idNotFound:
                throw new NotFoundException(update);
            case UsersServiceErrors.emptyUpdate:
                throw new BadRequestException(update);

            default:
                return update;
        }
    }
}
