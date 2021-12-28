import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { ReadBookDto } from './dtos';
import { RoleType } from '../role/roletype.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../role/guards/role.guard';
import { CreateBookDto } from './dtos/create-book.dto';
import { Roles } from '../role/decorators/role.decorator';
import { GetUser } from '../auth/user.decorator';
import { UpdateBookDto } from './dtos/update-book.dto';

// @UseGuards(AuthGuard(), RoleGuard)
@Controller('books')
export class BookController {
    constructor(private readonly _bookService: BookService) {}

    @Get(':bookId')
    getBook(
        @Param('bookId', ParseIntPipe) bookId: number,
    ): Promise<ReadBookDto> {
        return this._bookService.get(bookId);
    }

    @Get('author/:authorId')
    getBooksByAuthor(
        @Param('authorId', ParseIntPipe) authorId: number,
    ): Promise<ReadBookDto[]> {
        return this._bookService.getBooksByAuthor(authorId);
    }

    @Get()
    getBooks(): Promise<ReadBookDto[]> {
        return this._bookService.getAll();
    }

    @Post()
    @Roles(RoleType.AUTHOR)
    createBook(@Body() book: Partial<CreateBookDto>): Promise<ReadBookDto> {
        return this._bookService.create(book);
    }

    @Post()
    @Roles(RoleType.AUTHOR)
    createBookByAuthor(
        @Body() book: Partial<CreateBookDto>,
        @GetUser('id') authorId: number,
    ): Promise<ReadBookDto> {
        return this._bookService.createByAuthor(book, authorId);
    }

    @Patch(':bookId')
    updateBook(
        @Param('bookId', ParseIntPipe) bookId: number,
        @Body() book: Partial<UpdateBookDto>,
        @GetUser('id') authorId: number,
    ): Promise<ReadBookDto> {
        return this._bookService.update(bookId, book, authorId);
    }

    @Delete(':bookId')
    deleteBook(@Param('bookId', ParseIntPipe) bookId: number): Promise<void> {
        return this._bookService.delete(bookId);
    }
}
