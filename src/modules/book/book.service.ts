import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookRepository } from './book.repository';
import { UserRepository } from '../user/user.repository';
import { status } from '../../shared/entity-status.enum';
import { ReadBookDto } from './dtos/read-book.dto';
import { plainToClass } from 'class-transformer';
import { Book } from './book.entity';
import { In } from 'typeorm';
import { CreateBookDto } from './dtos/create-book.dto';
import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';
import { UpdateBookDto } from './dtos/update-book.dto';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(BookRepository)
        private readonly _bookRepository: BookRepository,
        @InjectRepository(UserRepository)
        private readonly _userRepository: UserRepository,
    ) {}

    async get(bookId: number): Promise<ReadBookDto> {
        if (!bookId) {
            throw new BadRequestException('userId must be sent');
        }

        const book = await this._bookRepository.findOne(bookId, {
            where: { status: status.ACTIVE },
        });

        if (!book) {
            throw new NotFoundException('book does not exists');
        }

        return plainToClass(ReadBookDto, book);
    }

    async getAll(): Promise<ReadBookDto[]> {
        const books: Book[] = await this._bookRepository.find({
            where: { status: status.ACTIVE },
        });

        return books.map((book: Book) => plainToClass(ReadBookDto, book));
    }

    async getBooksByAuthor(authorId: number): Promise<ReadBookDto[]> {
        if (!authorId) {
            throw new BadRequestException('authorId must be sent');
        }

        const books: Book[] = await this._bookRepository.find({
            relations: ['authors'],
            where: { status: status.ACTIVE, id: In([authorId]) },
        });

        return books.map((book: Book) => plainToClass(ReadBookDto, book));
    }

    async create(book: Partial<CreateBookDto>): Promise<ReadBookDto> {
        const authors: User[] = [];

        for (const authorId of book.authors) {
            const authorExists = await this._userRepository.findOne(authorId, {
                where: { status: status.ACTIVE },
            });

            if (!authorExists) {
                throw new NotFoundException(
                    `There's not an author with this Id: ${authorId}`,
                );
            }

            const isAuthor = authorExists.roles.some(
                (role: Role) => role.name === RoleType.AUTHOR,
            );

            if (!isAuthor) {
                throw new UnauthorizedException(
                    `This user ${authorId} is not an author`,
                );
            }

            authors.push(authorExists);
        }

        const savedBook: Book = await this._bookRepository.save({
            name: book.name,
            description: book.description,
            authors,
        });

        return plainToClass(ReadBookDto, savedBook);
    }

    async createByAuthor(book: Partial<CreateBookDto>, authorId: number) {
        const author = await this._userRepository.findOne(authorId, {
            where: { status: status.ACTIVE },
        });

        const isAuthor = author.roles.some(
            (role: Role) => role.name === RoleType.AUTHOR,
        );

        if (!isAuthor) {
            throw new UnauthorizedException(
                `This user ${authorId} is not an author`,
            );
        }

        const savedBook: Book = await this._bookRepository.save({
            name: book.name,
            description: book.description,
            author,
        });

        return plainToClass(ReadBookDto, savedBook);
    }

    async update(
        bookId: number,
        book: Partial<UpdateBookDto>,
        authorId: number,
    ): Promise<ReadBookDto> {
        const bookExists = await this._bookRepository.findOne(bookId, {
            where: { status: status.ACTIVE },
        });

        if (!bookExists) {
            throw new NotFoundException('This book does not exists');
        }

        const isOwnBook = bookExists.authors.some(
            (author) => author.id === authorId,
        );

        if (!isOwnBook) {
            throw new UnauthorizedException(
                `This user isn't the book's author`,
            );
        }

        const UpdateBook = await this._bookRepository.update(bookId, book);
        return plainToClass(ReadBookDto, UpdateBook);
    }

    async delete(bookId: number): Promise<void> {
        const bookExists = await this._bookRepository.findOne(bookId, {
            where: { status: status.ACTIVE },
        });

        if (!bookExists) {
            throw new NotFoundException('This book does not exists');
        }

        await this._bookRepository.update(bookId, { status: status.INACTIVE });
    }
}
