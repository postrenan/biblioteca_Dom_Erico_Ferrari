import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { LoansModule } from './loans/loans.module';
import { PrismaModule } from './prisma/prisma.module';
import { FinesModule } from './fines/fines.module';
import { SeriesModule } from './series/series.module';
import { DataModule } from './data/data.module';
import { CategoriesModule } from './categories/categories.module';
import { UploadsModule } from './uploads/uploads.module';
import { SettingsModule } from './settings/settings.module';
import { SuggestionsModule } from './suggestions/suggestions.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { RequiredReadingsModule } from './required-readings/required-readings.module';
import { WaitingListModule } from './waiting-list/waiting-list.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    BooksModule,
    LoansModule,
    PrismaModule,
    FinesModule,
    SeriesModule,
    DataModule,
    CategoriesModule,
    UploadsModule,
    SettingsModule,
    SuggestionsModule,
    WishlistModule,
    WishlistModule,
    RequiredReadingsModule,
    WaitingListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
