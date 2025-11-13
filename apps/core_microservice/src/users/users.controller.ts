// src/users/controllers/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserMappers } from './utils/params-mapper.util';
import { UsersService } from './users.service';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const params = UserMappers.toCreateParams(createUserDto);
    const user = await this.userService.create(params);
    return UserMappers.toResponse(user);
  }

  @Get()
  @ApiOperation({ summary: 'Get users list' })
  @ApiResponse({
    status: 200,
    description: 'Users list retrieved successfully',
    type: PaginationResponseDto<UserResponseDto>,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    type: String,
    description: 'Filter by role',
  })
  @ApiQuery({
    name: 'disabled',
    required: false,
    type: Boolean,
    description: 'Filter by disabled status',
  })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('role') role?: string,
    @Query('disabled') disabled?: boolean,
  ): Promise<PaginationResponseDto<UserResponseDto>> {
    const params = {
      page,
      limit,
      role,
      disabled: disabled === undefined ? undefined : Boolean(disabled),
    };
    const result = await this.userService.findAll(params);
    return UserMappers.toPaginationResponse(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findOne(id);
    return UserMappers.toResponse(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const params = UserMappers.toUpdateParams(id, updateUserDto);
    const user = await this.userService.update(params);
    return UserMappers.toResponse(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user permanently' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted permanently' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiQuery({
    name: 'deletedById',
    required: true,
    type: Number,
    description: 'ID of user performing deletion',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('deletedById', ParseIntPipe) deletedById: number,
  ): Promise<void> {
    await this.userService.remove(id);
  }

  @Delete(':id/soft')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete user' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User disabled successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiQuery({
    name: 'deletedById',
    required: true,
    type: Number,
    description: 'ID of user performing deletion',
  })
  async softRemove(
    @Param('id', ParseIntPipe) id: number,
    @Query('deletedById', ParseIntPipe) deletedById: number,
  ): Promise<void> {
    await this.userService.softRemove(id, deletedById);
  }
}
