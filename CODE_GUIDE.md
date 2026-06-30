# Beginner Guide to This Fintech API

This guide explains the project one file at a time in simple words.

You do not need to memorize everything. Read it in this order:

1. Learn the basic NestJS words.
2. Read `src/main.ts` and `src/app.module.ts`.
3. Read the Prisma files.
4. Read the auth files.
5. Read accounts, transfers, and transactions.
6. Read the AI and insights files.

## 1. The basic NestJS idea

NestJS splits an application into small features called modules.

Each feature normally has these files:

- **Module**: connects the feature's files.
- **Controller**: receives HTTP requests.
- **Service**: contains the main work.
- **DTO**: checks request or response data.
- **Entity**: describes data returned by the API.

For example, the accounts feature has:

```text
accounts/
  accounts.module.ts
  accounts.controller.ts
  accounts.service.ts
  dto/account-response.dto.ts
  entities/account.entity.ts
```

### How one request moves through the app

When a user calls `GET /accounts/me`, this happens:

```text
HTTP request
    ↓
Validation and JWT guard
    ↓
AccountsController
    ↓
AccountsService
    ↓
PrismaService
    ↓
PostgreSQL / Supabase
    ↓
JSON response
```

The controller should stay small. It accepts the request and calls a service.

The service does the real work, such as reading the database or moving money.

## 2. Common NestJS words

### Module

A module groups related code.

```ts
@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
```

Here:

- `controllers` lists the HTTP controllers.
- `providers` lists services that NestJS can create.
- `imports` brings in another module.
- `exports` lets another module use one of this module's providers.

### Controller

A controller handles URLs.

```ts
@Controller('accounts')
export class AccountsController {}
```

`@Controller('accounts')` means every route in this class starts with `/accounts`.

### Service

A service contains application logic.

```ts
@Injectable()
export class AccountsService {}
```

`@Injectable()` tells NestJS that it can create this class and give it other services.

### Dependency injection

Dependency injection means NestJS creates objects for you.

```ts
constructor(private readonly prisma: PrismaService) {}
```

You do not write `new PrismaService()` yourself.

NestJS sees `PrismaService` in the constructor and passes it into the class.

### DTO

DTO means **Data Transfer Object**.

A DTO describes data entering or leaving an endpoint.

```ts
export class LoginDto {
  email: string;
  password: string;
}
```

Validation decorators can check those fields before the controller runs.

### Entity

In this project, an entity class describes the JSON returned by an endpoint. It also helps Swagger show the correct response shape.

The actual database tables are described in `schema.prisma`.

### Guard

A guard decides whether a request is allowed.

The JWT guard blocks requests that do not have a valid login token.

### Pipe

A pipe checks or changes request data.

This project uses one global `ValidationPipe` for every endpoint.

### Exception filter

An exception filter catches errors and returns one clear JSON error format.

## 3. Project folder map

```text
src/
  main.ts
  app.module.ts
  app.controller.ts

  auth/
    auth.module.ts
    auth.controller.ts
    auth.service.ts
    dto/login.dto.ts
    dto/register.dto.ts
    entities/auth-response.entity.ts
    guards/jwt-auth.guard.ts
    strategies/jwt.strategy.ts

  users/
    users.module.ts
    users.controller.ts
    users.service.ts
    entities/user.entity.ts

  accounts/
    accounts.module.ts
    accounts.controller.ts
    accounts.service.ts
    dto/account-response.dto.ts
    entities/account.entity.ts

  transfers/
    transfers.module.ts
    transfers.controller.ts
    transfers.service.ts
    dto/create-transfer.dto.ts
    entities/transfer.entity.ts

  transactions/
    transactions.module.ts
    transactions.controller.ts
    transactions.service.ts
    dto/correct-category.dto.ts
    entities/transaction.entity.ts

  ai/
    ai.module.ts
    gemini.service.ts
    categorization.service.ts
    ai.service.ts
    dto/categorize-transaction.dto.ts
    entities/categorization-result.entity.ts

  insights/
    insights.module.ts
    insights.controller.ts
    insights.service.ts
    dto/insights-response.dto.ts
    entities/insight-transaction.entity.ts

  prisma/
    prisma.module.ts
    prisma.service.ts
    schema.prisma
    migrations/

  common/
    constants/categories.ts
    decorators/current-user.decorator.ts
    filters/http-exception.filter.ts
    types/authenticated-user.type.ts

  generated/prisma/
    Generated Prisma Client files
```

## 4. Root project files

### `package.json`

This is the Node.js project file.

It contains:

- The project name and version.
- Commands inside `scripts`.
- Packages needed while the app runs.
- Packages needed only while developing.

Important commands:

```bash
npm run start:dev
npm run build
npm run start:prod
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

- `start:dev` runs NestJS and reloads after code changes.
- `build` converts TypeScript into JavaScript inside `dist/`.
- `start:prod` runs the built JavaScript.
- `prisma:generate` creates the typed Prisma Client.
- `prisma:migrate` applies database migrations.
- `prisma:studio` opens Prisma's database viewer.

### `package-lock.json`

This file records the exact installed package versions.

Do not edit it by hand. `npm install` updates it.

### `tsconfig.json`

This controls the TypeScript compiler.

Important options:

- `strict: true`: TypeScript checks types carefully.
- `experimentalDecorators: true`: allows decorators such as `@Controller()`.
- `emitDecoratorMetadata: true`: gives NestJS type details at runtime.
- `target: ES2022`: creates modern JavaScript.
- `outDir: ./dist`: compiled files go into `dist/`.
- `include: ["src/**/*.ts"]`: compile TypeScript files inside `src`.

### `tsconfig.build.json`

This is the TypeScript setup used for the production build.

It extends `tsconfig.json` and skips folders that should not be built.

### `nest-cli.json`

This tells the NestJS command line that source code starts in `src/`.

`deleteOutDir: true` removes the old `dist/` files before a new build.

### `.env`

This contains real secrets and connection strings.

It is ignored by Git and must not be pushed to GitHub.

The app expects:

```text
DATABASE_URL
DIRECT_URL
JWT_SECRET
GEMINI_API_KEY
PORT
```

- `DATABASE_URL`: used by the running app.
- `DIRECT_URL`: used by Prisma migrations.
- `JWT_SECRET`: signs and checks login tokens.
- `GEMINI_API_KEY`: calls Gemini.
- `PORT`: tells the server which port to use.

The code also supports the current `GEMINI_aPI_KEY` spelling in your `.env`.

### `.env.example`

This shows which environment variables are needed without containing real secrets.

### `prisma.config.ts`

This tells the Prisma command line where to find the schema and migrations.

```ts
schema: 'src/prisma/schema.prisma'
```

Prisma uses `DIRECT_URL` when it exists. Otherwise, it uses `DATABASE_URL`.

### `DECISIONS.md`

This explains why the project uses Prisma, idempotency keys, row locks, Gemini examples, and other choices.

This file is important for the job assessment because reviewers want to understand your decisions.

### `README.md`

This tells another developer how to install, run, and use the project.

### `Dockerfile`

This describes how to build a Docker image for the API.

### `render.yaml`

This describes how Render can build and run the API.

### `.gitignore`

This tells Git not to store files such as `.env`, `node_modules`, `dist`, and generated Prisma code.

### `.prettierrc`

This controls automatic code formatting.

It uses single quotes and keeps trailing commas where TypeScript allows them.

### `.dockerignore`

This tells Docker not to copy local folders and secrets such as `node_modules`, `dist`, `.env`, `.git`, and log files into the image build.

## 5. App startup files

### `src/main.ts`

This is the first application file that runs.

#### Imports

```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
```

- `NestFactory` creates the NestJS application.
- `ValidationPipe` checks every DTO.

#### `bootstrap()`

```ts
async function bootstrap(): Promise<void> {}
```

- `async` means this function can wait for promises.
- `Promise<void>` means it finishes later and does not return data.

#### Create the app

```ts
const app = await NestFactory.create(AppModule);
```

NestJS starts from `AppModule` and discovers the other modules from it.

#### Shutdown hooks

```ts
app.enableShutdownHooks();
```

This lets NestJS close database connections when the process stops.

#### Global validation

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
);
```

- `whitelist: true` removes fields that are not listed in the DTO.
- `transform: true` lets decorators change input values, such as turning an amount into a number.

#### Global error filter

```ts
app.useGlobalFilters(new HttpExceptionFilter());
```

Every error passes through the same filter before it is returned.

#### CORS

```ts
app.enableCors();
```

CORS allows a browser frontend on another domain to call the API.

#### Swagger

`DocumentBuilder` creates the Swagger title, description, version, and bearer-token setting.

```ts
SwaggerModule.setup('api/docs', app, document);
```

Swagger is available at `/api/docs`.

#### Start listening

The code reads `PORT`. If it is missing or invalid, it uses port `3000`.

```ts
await app.listen(port);
```

#### Why `void bootstrap()`?

`bootstrap()` returns a promise. `void` says the function is intentionally started without using its return value.

### `src/app.module.ts`

This is the root module.

```ts
@Module({
  imports: [...],
  controllers: [AppController],
})
export class AppModule {}
```

`@Module()` is a decorator. It attaches NestJS settings to the class.

The imported modules are:

- `ConfigModule`: loads `.env`.
- `PrismaModule`: gives database access.
- `AuthModule`: register, login, and JWT.
- `UsersModule`: user profile.
- `AccountsModule`: account balance.
- `AiModule`: Gemini, categories, and insight calculations.
- `TransfersModule`: sends money.
- `TransactionsModule`: transaction history and corrections.
- `InsightsModule`: `/insights` endpoint.

```ts
ConfigModule.forRoot({ isGlobal: true, cache: true })
```

- `isGlobal: true` lets every module use `ConfigService`.
- `cache: true` avoids reading the same environment value many times.

### `src/app.controller.ts`

This controller provides `GET /health`.

Decorators:

- `@ApiTags('System')`: groups it under System in Swagger.
- `@Controller()`: uses no route prefix.
- `@Get('health')`: handles `GET /health`.
- `@ApiOperation()`: adds a short Swagger description.
- `@ApiOkResponse()`: shows the successful response in Swagger.

The constructor receives:

- `PrismaService` to test the database.
- `ConfigService` to check if the Gemini key exists.

```ts
await this.prisma.$queryRaw`SELECT 1`;
```

This sends a tiny query to PostgreSQL. If it works, the database is connected.

The endpoint returns:

```json
{
  "status": "ok",
  "database": "connected",
  "aiConfigured": true
}
```

It only returns whether an AI key exists. It never returns the secret key.

## 6. Prisma and database files

### `src/prisma/prisma.module.ts`

```ts
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

- `@Global()` means other modules can use `PrismaService` without importing `PrismaModule` again.
- `providers` tells NestJS to create `PrismaService`.
- `exports` makes that service available outside this module.

### `src/prisma/prisma.service.ts`

This is the main database service.

```ts
export class PrismaService extends PrismaClient
```

`extends PrismaClient` means `PrismaService` receives Prisma methods such as:

```ts
this.prisma.user.findUnique(...)
this.prisma.transfer.create(...)
this.prisma.$transaction(...)
```

#### Constructor

The constructor gets `DATABASE_URL` from `ConfigService`.

If it is missing, the app stops with a clear error.

`PrismaPg` is the PostgreSQL adapter used by Prisma 7.

Its options set:

- Connection timeout: 5 seconds.
- Idle connection timeout: 30 seconds.
- Maximum pool size: 10 connections.

#### Lifecycle methods

```ts
implements OnModuleInit, OnModuleDestroy
```

This promises that the class has two NestJS lifecycle methods.

- `onModuleInit()` connects when the app starts.
- `onModuleDestroy()` disconnects when the app stops.

### `src/prisma/schema.prisma`

This file describes PostgreSQL tables and relations.

#### Generator block

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}
```

This tells Prisma to generate typed TypeScript database code.

#### Datasource block

```prisma
datasource db {
  provider = "postgresql"
}
```

This says the database is PostgreSQL.

The connection URL is in `prisma.config.ts`, not here.

#### Enums

An enum is a fixed list of allowed values.

`TransferStatus` allows:

- `PENDING`
- `COMPLETED`
- `FAILED`

`TransactionType` allows:

- `CREDIT`: money entered the account.
- `DEBIT`: money left the account.

`Category` allows the eight transaction categories.

`@map()` changes the database value or column name without changing the TypeScript name.

#### User model

The `User` model stores:

- `id`: UUID primary key.
- `email`: unique email.
- `passwordHash`: hashed password, never the plain password.
- `name`.
- `createdAt`.
- `account`: the user's one account.

Important Prisma field decorators:

- `@id`: primary key.
- `@default(uuid())`: create a UUID automatically.
- `@unique`: no duplicate value is allowed.
- `@db.Uuid`: use PostgreSQL UUID.
- `@db.VarChar(320)`: limit the database string size.
- `@map("password_hash")`: database column uses snake case.
- `@@map("users")`: database table is called `users`.

#### Account model

The `Account` model stores:

- Its user ID.
- Exact decimal balance.
- Currency.
- Transfer and transaction relations.

```prisma
balance Decimal @default(0) @db.Decimal(18, 2)
```

This stores money as a decimal with two digits after the decimal point. It does not use `Float`.

`userId` is unique, so one user has one account.

#### Transfer model

A transfer represents one money movement.

It stores:

- Unique idempotency key.
- Sender account ID.
- Receiver account ID.
- Amount.
- Status.
- Description.
- Creation time.

The unique idempotency key prevents the same transfer from being inserted twice.

#### Transaction model

A transaction is one account's view of a transfer.

One transfer creates:

- One `DEBIT` transaction for the sender.
- One `CREDIT` transaction for the receiver.

It stores both:

- `category`: Gemini's prediction.
- `correctedCategory`: the user's correction, if one exists.

#### CategoryCorrection model

This stores feedback when a user changes a category.

It records:

- Transaction ID.
- Old category.
- New category.
- Time of correction.

The AI categorizer uses the last five correction rows as prompt examples.

#### Relations

This is a relation:

```prisma
user User @relation(fields: [userId], references: [id])
```

It means `Account.userId` points to `User.id`.

`onDelete: Restrict` means PostgreSQL will not delete a row if another important row still points to it.

#### Indexes

`@@index()` helps PostgreSQL search and sort common queries faster.

For example, transfer history is searched by account ID and sorted by creation time.

### `src/prisma/migrations/`

Migrations are SQL changes applied to PostgreSQL.

The first migration creates all enums, tables, indexes, foreign keys, and money safety checks.

Do not change an already-applied migration casually. Create a new migration for later schema changes.

#### `src/prisma/migrations/migration_lock.toml`

This tiny file says the migration system uses PostgreSQL.

Prisma manages this file.

#### `src/prisma/migrations/20260629000000_init/migration.sql`

This is the first real SQL migration.

It creates the current database structure. It also adds database checks such as:

- Account balance cannot be negative.
- Transfer amount must be above zero.
- Sender and receiver accounts must be different.
- Transaction amount must be above zero.

### `src/generated/prisma/`

Prisma creates these files from `schema.prisma`.

Do not edit them by hand.

Important generated files include:

- `client.ts`: exports `PrismaClient` and Prisma types.
- `enums.ts`: exports category, transaction type, and transfer status enums.
- `models.ts`: exports model types.
- `models/User.ts`, `Account.ts`, `Transfer.ts`, `Transaction.ts`, and `CategoryCorrection.ts`: generated types for each model.
- `internal/`: code used inside the generated Prisma Client.
- `browser.ts`: safe Prisma types that can be imported without server database code.

Run this after changing the schema:

```bash
npm run prisma:generate
```

## 7. Common shared files

### `src/common/constants/categories.ts`

This file keeps category names in one place.

`CATEGORY_LABELS` is the public list shown to users and Gemini.

```ts
export const CATEGORY_LABELS = [
  'Food & Dining',
  'Transport',
  // ...
] as const;
```

`as const` tells TypeScript that these exact strings should not change.

`CategoryLabel` becomes a TypeScript type containing only those eight strings.

`CATEGORY_TO_LABEL` converts a Prisma enum such as `FOOD_DINING` into `Food & Dining`.

`LABEL_TO_CATEGORY` converts `Food & Dining` back into the Prisma enum.

`isCategoryLabel()` checks whether a string is one of the supported categories.

### `src/common/types/authenticated-user.type.ts`

This type describes `request.user` after JWT validation.

```ts
export type AuthenticatedUser = {
  userId: string;
  email: string;
};
```

It does not contain the password or balance.

### `src/common/decorators/current-user.decorator.ts`

This creates a custom `@CurrentUser()` decorator.

```ts
export const CurrentUser = createParamDecorator(...)
```

Passport puts the validated user inside `request.user`.

The custom decorator reads that value so controllers can use:

```ts
@CurrentUser() user: AuthenticatedUser
```

Without it, every controller would need to read the raw Express request manually.

### `src/common/filters/http-exception.filter.ts`

This catches all request errors.

```ts
@Catch()
export class HttpExceptionFilter implements ExceptionFilter
```

`@Catch()` without a class means it catches every thrown error.

For a normal NestJS `HttpException`, it keeps the correct status code.

For an unexpected error, it returns `500` and hides private database details.

Every error uses this shape:

```json
{
  "statusCode": 400,
  "message": "Insufficient balance",
  "error": "Insufficient balance",
  "timestamp": "2026-06-29T10:00:00.000Z",
  "path": "/transfers"
}
```

Unexpected details are written to server logs instead of sent to the client.

## 8. Authentication files

### `src/auth/auth.module.ts`

This connects all auth pieces.

It imports:

- `ConfigModule` for the JWT secret.
- `PassportModule` for authentication.
- `JwtModule` for signing tokens.

```ts
PassportModule.register({ defaultStrategy: 'jwt' })
```

This makes JWT the default Passport strategy.

`JwtModule.registerAsync()` waits for `ConfigService` and reads `JWT_SECRET`.

The token lifetime is seven days:

```ts
expiresIn: 7 * 24 * 60 * 60
```

The module creates these providers:

- `AuthService`
- `JwtStrategy`
- `JwtAuthGuard`

It exports `JwtAuthGuard` so other modules can protect routes.

### `src/auth/dto/register.dto.ts`

This validates `POST /auth/register`.

Fields:

- `email`
- `name`
- `password`

Decorators:

- `@ApiProperty()`: shows the field in Swagger.
- `@Transform()`: trims spaces and lowercases the email.
- `@IsEmail()`: requires a valid email.
- `@IsString()`: requires text.
- `@MinLength()`: minimum length.
- `@MaxLength()`: maximum length.

The password must contain 8 to 72 characters.

### `src/auth/dto/login.dto.ts`

This validates `POST /auth/login`.

It lowercases and trims the email just like registration.

The password must be present.

### `src/auth/entities/auth-response.entity.ts`

This describes a successful auth response:

```json
{
  "accessToken": "JWT value",
  "user": {
    "id": "UUID",
    "email": "alex@example.com",
    "name": "Alex Morgan",
    "createdAt": "date"
  }
}
```

The password hash is not included.

### `src/auth/auth.controller.ts`

This controller starts with `/auth`.

#### Register route

```ts
@Post('register')
register(@Body() dto: RegisterDto)
```

- Full route: `POST /auth/register`.
- `@Body()` reads JSON from the request body.
- NestJS validates it as `RegisterDto`.
- The controller calls `authService.register(dto)`.

#### Login route

```ts
@Post('login')
@HttpCode(HttpStatus.OK)
```

Full route: `POST /auth/login`.

NestJS normally returns `201` for POST. `@HttpCode(HttpStatus.OK)` changes login to `200`.

The `@Api...` decorators in this file only document the routes in Swagger. They do not contain business logic.

### `src/auth/auth.service.ts`

This contains registration and login logic.

#### Constructor

NestJS injects:

- `PrismaService` for database work.
- `JwtService` for tokens.

#### Registration flow

1. Check that the password is not over bcrypt's 72-byte limit.
2. Search for an existing email.
3. Return `409 Conflict` if the email exists.
4. Hash the password with bcrypt and 10 salt rounds.
5. Create the user and account in one nested Prisma query.
6. Select only public user fields.
7. Sign and return a JWT.

```ts
const passwordHash = await hash(dto.password, 10);
```

The database stores the hash, not the real password.

```ts
account: {
  create: {},
}
```

This creates the user's zero-balance account at the same time as the user.

The `P2002` catch handles two register requests using the same email at the same time. `P2002` is Prisma's unique-constraint error.

#### Login flow

1. Find the user by email.
2. Return `401 Unauthorized` if the user does not exist.
3. Compare the submitted password with the stored bcrypt hash.
4. Return the same `401` message if the password is wrong.
5. Sign and return a JWT.

Using the same error for a missing user and wrong password reveals less information to attackers.

#### JWT payload

```ts
{
  sub: user.id,
  email: user.email,
}
```

`sub` means subject. It stores the user ID.

### `src/auth/strategies/jwt.strategy.ts`

This tells Passport how to read and check JWTs.

```ts
jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
```

It reads this HTTP header:

```text
Authorization: Bearer <token>
```

`ignoreExpiration: false` rejects expired tokens.

After Passport verifies the token, `validate()` returns:

```ts
{ userId: payload.sub, email: payload.email }
```

Passport places that object on `request.user`.

### `src/auth/guards/jwt-auth.guard.ts`

This small class turns Passport's JWT strategy into a NestJS guard.

```ts
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

Controllers use it with:

```ts
@UseGuards(JwtAuthGuard)
```

## 9. Users files

### `src/users/users.module.ts`

This connects `UsersController` and `UsersService`.

It imports `AuthModule` because its route uses the JWT guard.

### `src/users/entities/user.entity.ts`

This describes public user data:

- ID
- Email
- Name
- Creation time

It deliberately has no password field.

### `src/users/users.controller.ts`

Class decorators:

```ts
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
```

- Swagger groups the route under Users.
- Swagger shows a bearer token input.
- JWT guard protects every route in the class.
- The URL prefix is `/users`.

`@Get('me')` creates `GET /users/me`.

`@CurrentUser()` reads the logged-in user from the token.

### `src/users/users.service.ts`

The service finds a user by ID and selects only public fields.

If the user does not exist, it throws `NotFoundException`, which returns HTTP `404`.

## 10. Accounts files

### `src/accounts/accounts.module.ts`

This connects the controller and service and imports auth protection.

### `src/accounts/entities/account.entity.ts`

This describes the main account fields returned by the API:

- Account ID
- Balance as a string
- Currency
- Creation date

The balance is a string such as `"25.50"` so JSON does not change decimal money.

### `src/accounts/dto/account-response.dto.ts`

This extends `AccountEntity` and adds the owner's public name and email.

```ts
export class AccountResponseDto extends AccountEntity
```

`extends` means it receives the fields from `AccountEntity` and adds more fields.

### `src/accounts/accounts.controller.ts`

This creates the protected `GET /accounts/me` route.

It reads the user from the JWT and passes `user.userId` to the service.

### `src/accounts/accounts.service.ts`

The service finds the one account whose `userId` matches the logged-in user.

It also selects the user's name and email.

```ts
balance: account.balance.toFixed(2)
```

This formats Prisma Decimal as two decimal places.

## 11. Transfers files

This is the most important financial feature.

### `src/transfers/transfers.module.ts`

This module connects the transfer controller and service.

It imports:

- `AuthModule` for protected routes.
- `AiModule` for background categorization.

### `src/transfers/dto/create-transfer.dto.ts`

This validates `POST /transfers`.

Fields:

#### `idempotencyKey`

```ts
@IsUUID('4')
idempotencyKey: string;
```

The client creates this UUID. Retrying the same transfer must reuse the same UUID.

#### `toEmail`

The DTO trims and lowercases the recipient email, checks the email format, and limits its length.

#### `amount`

```ts
@Type(() => Number)
@IsNumber({ maxDecimalPlaces: 2 })
@IsPositive()
```

- `@Type(() => Number)` converts input to a number.
- `@IsNumber()` rejects NaN, infinity, and more than two decimal places.
- `@IsPositive()` requires more than zero.
- `@Max()` prevents an unsafe huge JavaScript number.

#### `description`

The description is optional and limited to 500 characters.

An empty description becomes `undefined`.

### `src/transfers/entities/transfer.entity.ts`

This describes a transfer response.

It includes:

- Transfer ID.
- Idempotency key.
- Sender account and user details.
- Receiver account and user details.
- Amount.
- Status.
- Description.
- Creation time.

### `src/transfers/transfers.controller.ts`

The class is protected by `JwtAuthGuard` and uses `/transfers`.

#### Create transfer

```ts
@Post()
@HttpCode(HttpStatus.OK)
```

This creates `POST /transfers` and returns `200`.

Using `200` is useful because a replay also returns the original result with `200`.

#### List transfers

```ts
@Get()
```

This creates `GET /transfers`.

### `src/transfers/transfers.service.ts`

This file protects the balance from duplicate and concurrent transfers.

#### `transferSelect`

This object tells Prisma exactly which transfer fields and relations to return.

It includes sender and receiver names for the response and transaction IDs for AI categorization.

```ts
type TransferRecord = Prisma.TransferGetPayload<...>
```

This creates a TypeScript type from that Prisma selection.

#### Step 1: Check the idempotency key

```ts
const existing = await this.prisma.transfer.findUnique({
  where: { idempotencyKey: dto.idempotencyKey },
});
```

If the key already exists for the sender, the service returns the old transfer and moves no money.

If another user owns the key, it returns `409 Conflict` instead of exposing that user's transfer.

#### Step 2: Check the amount

The DTO already validates it, but the service also checks that the amount is above zero.

#### Step 3: Find the sender

The service finds the logged-in user's account.

Missing sender account returns `404`.

#### Step 4: Find the recipient

The service finds the user by `toEmail` and gets that user's account.

It rejects:

- Missing recipient.
- Sending to yourself.
- Missing recipient account.
- Different currencies.

#### Step 5: Create an exact amount

```ts
const amount = new Prisma.Decimal(dto.amount.toString());
```

Prisma Decimal is used before checking or updating money.

#### Step 6: Start one database transaction

```ts
await this.prisma.$transaction(async (tx) => {
  // all money work happens here
});
```

If anything inside fails, PostgreSQL rolls everything back.

This prevents a sender debit without a receiver credit.

#### Step 7: Sort and lock both accounts

The two account IDs are sorted first.

Every transfer locks accounts in the same order. This lowers deadlock risk when two users send to each other at the same time.

Each row is locked with:

```sql
SELECT id, balance, currency
FROM accounts
WHERE id = ...
FOR UPDATE
```

`FOR UPDATE` stops another transfer from changing that account until this transaction ends.

#### Step 8: Check the key again

Another request may have completed while this request waited for the account lock.

The second key check sees that transfer and returns it without moving money again.

#### Step 9: Check the locked balance

```ts
if (lockedSender.balance < amount) {
  throw new BadRequestException('Insufficient balance');
}
```

The real code uses Prisma Decimal's `lessThan()` method.

The check happens after the row lock. That is important because the balance cannot change between this check and the debit.

#### Step 10: Update both balances

The sender balance uses `decrement`.

The receiver balance uses `increment`.

Both updates are inside the same transaction.

#### Step 11: Save records

The service creates:

- One completed transfer.
- One sender debit transaction.
- One receiver credit transaction.

Prisma's nested `transactions.create` saves both transaction records with the transfer.

#### Step 12: Commit

Returning from the callback lets Prisma commit the database transaction.

If any query throws, Prisma rolls it back.

#### Step 13: Start AI categorization

AI calls start only after the money transaction has completed.

```ts
void this.categorization.categorizeTransaction(...)
```

`void` means the HTTP response does not wait for Gemini.

Gemini failure cannot undo a completed transfer.

#### Unique key race

The database also has a unique constraint on `idempotencyKey`.

If two inserts somehow race, Prisma throws `P2002`. The service catches it, reads the saved transfer, and returns that result.

#### Database conflict

Serialization and deadlock codes return HTTP `409`, asking the client to retry.

#### `listForUser()`

This finds the user's account, then returns transfers where that account is either sender or receiver.

Results are sorted newest first.

#### `categorize()`

This starts category work for both the debit and credit records.

The sender's correction history is used for the sender record. The receiver's correction history is used for the receiver record.

#### `toEntity()`

This changes the Prisma result into the clean transfer response shown by the API.

It avoids returning account balances or other private database fields.

## 12. Transactions files

### `src/transactions/transactions.module.ts`

This connects the protected transaction controller and service.

### `src/transactions/dto/correct-category.dto.ts`

This validates the body for a category correction.

```json
{
  "category": "Food & Dining"
}
```

`@IsIn(CATEGORY_LABELS)` only allows one of the eight supported names.

### `src/transactions/entities/transaction.entity.ts`

The response has:

- `category`: Gemini's prediction.
- `correctedCategory`: the user's correction or `null`.
- `effectiveCategory`: correction when it exists, otherwise prediction.

This keeps both the AI answer and the user-approved answer.

### `src/transactions/transactions.controller.ts`

Protected routes:

- `GET /transactions`
- `PATCH /transactions/:id/category`

```ts
@Param('id', new ParseUUIDPipe({ version: '4' }))
```

`@Param('id')` reads the ID from the URL.

`ParseUUIDPipe` rejects an invalid UUID before the service runs.

### `src/transactions/transactions.service.ts`

#### History

`listForUser()` finds transactions through account ownership and sorts them newest first.

#### Correction

`correctCategory()`:

1. Finds the transaction only if it belongs to the logged-in user.
2. Returns `404` if it is missing or belongs to another user.
3. Finds the current effective category.
4. Converts the public category name into a Prisma enum.
5. Rejects a correction to the same category.
6. Runs two writes in one Prisma transaction.

The writes are:

- Create a `CategoryCorrection` feedback row.
- Update `Transaction.correctedCategory`.

The array passed to `$transaction()` means both writes succeed or both fail.

#### `toEntity()`

This converts Prisma enum names into readable category labels and formats Decimal as a string.

## 13. Gemini and categorization files

### `src/ai/ai.module.ts`

This module creates:

- `GeminiService`: talks to Google's API.
- `CategorizationService`: builds category prompts.
- `AiService`: calculates spending insights and asks for a summary.

It exports category and insight services for transfer and insight modules.

### `src/ai/gemini.service.ts`

This is the only file that directly calls Gemini.

#### Model list

The service tries:

1. `gemini-2.5-flash`
2. `gemini-2.0-flash`
3. `gemini-2.0-flash-001`

It uses a `for` loop. If one model fails, it continues to the next.

#### Get the key

`ConfigService` reads `GEMINI_API_KEY` or the existing `GEMINI_aPI_KEY` spelling.

Missing key throws `ServiceUnavailableException`, which returns HTTP `503` when used directly.

#### HTTP request

The service uses Node's built-in `fetch()`.

```ts
method: 'POST'
```

The API key is sent in this header:

```text
x-goog-api-key: <secret>
```

The key is not placed in the URL or logs.

The request body sends:

- System prompt.
- User prompt.
- Temperature `0` for more stable answers.
- Maximum output tokens.

Thinking is disabled for `gemini-2.5-flash` because category answers should be short.

#### Timeout

```ts
AbortSignal.timeout(15_000)
```

One model gets at most 15 seconds.

#### Read the response

The service reads the first candidate's text parts, removes thought parts, joins the text, and trims spaces.

It returns:

```ts
{
  text: 'Transfers',
  model: 'gemini-2.5-flash',
}
```

If all models fail, it throws `Gemini is not available`.

### `src/ai/dto/categorize-transaction.dto.ts`

This internal DTO carries:

- Credit or debit type.
- Exact amount string.
- Description.
- User ID.

It is passed by the transfer service, not by a public HTTP endpoint.

### `src/ai/entities/categorization-result.entity.ts`

This describes the internal category result:

- Chosen category.
- Gemini model name, or `null` after fallback.

### `src/ai/categorization.service.ts`

This service turns transaction data into a Gemini category.

#### Load correction examples

It reads the logged-in user's five latest corrections.

The database query follows:

```text
CategoryCorrection
    → Transaction
    → Account
    → userId
```

This prevents one user's corrections from affecting another user.

#### Build examples

Each feedback row becomes text like:

```text
'Uber ride' was corrected to 'Transport'
```

These examples are called **few-shot examples**. They show Gemini how this user categorizes similar descriptions.

#### Build the prompt

The system prompt lists the eight allowed categories and asks for only one category name.

The user prompt contains:

- Recent corrections.
- Credit or debit type.
- Amount.
- Description.

#### Safe fallback

The default category is `Transfers`.

The service only accepts Gemini output when `isCategoryLabel()` says it exactly matches the supported list.

If Gemini throws an error, the service logs a warning and keeps `Transfers`.

#### Save the prediction

The final category is converted to a Prisma enum and saved to `Transaction.category`.

It does not overwrite `correctedCategory`.

## 14. Insights files

### `src/insights/insights.module.ts`

This connects the protected insights endpoint to the AI module.

### `src/insights/insights.controller.ts`

This creates protected `GET /insights`.

It reads the JWT user and calls `InsightsService.getForUser(userId)`.

### `src/insights/insights.service.ts`

This is a small bridge between the HTTP controller and `AiService`.

Keeping the controller small makes the route easy to read.

### `src/insights/entities/insight-transaction.entity.ts`

This describes one unusual or largest transaction in an insight response.

### `src/insights/dto/insights-response.dto.ts`

This describes the whole response:

- Category totals.
- Six monthly totals.
- Unusual transactions.
- Largest transaction.
- AI summary.

The small nested DTO classes help Swagger show the array item shapes.

### `src/ai/ai.service.ts`

Despite its name, most work in this service is normal TypeScript math. Gemini only writes the final paragraph.

#### Query spending

The service loads only `DEBIT` transactions for the user.

Credits are incoming money, so they are not counted as spending.

#### Category totals

A `Map` stores one exact Prisma Decimal total per category.

For every transaction, the service uses:

```ts
correctedCategory ?? category
```

`??` means use the value on the right only when the left value is `null` or `undefined`.

Totals are sorted from largest to smallest.

#### Monthly totals

The service creates six month keys, including months with no spending.

Each transaction amount is added to its UTC month.

#### Average and unusual activity

The service calculates the average debit amount.

Any debit greater than `2.5 × average` is marked unusual.

#### Largest transaction

`reduce()` walks through all debit transactions and keeps the largest amount.

#### Gemini summary

All totals are already calculated before Gemini is called.

Gemini receives JSON data and writes only a short explanation.

Gemini never decides the balance or calculates the totals.

If Gemini is unavailable, the service returns a simple summary made by the code.

## 15. Decorator glossary

Decorators begin with `@` and add information to a class, method, or field.

### NestJS class decorators

| Decorator | Meaning |
| --- | --- |
| `@Module()` | Defines a NestJS module. |
| `@Controller('path')` | Defines a controller and URL prefix. |
| `@Injectable()` | Lets NestJS create and inject a class. |
| `@Global()` | Makes a module's exports available everywhere. |
| `@Catch()` | Defines an exception filter. |

### NestJS route decorators

| Decorator | Meaning |
| --- | --- |
| `@Get()` | Handles an HTTP GET request. |
| `@Post()` | Handles an HTTP POST request. |
| `@Patch()` | Handles an HTTP PATCH request. |
| `@HttpCode()` | Changes the response status code. |
| `@UseGuards()` | Runs a guard before the route. |

### NestJS parameter decorators

| Decorator | Meaning |
| --- | --- |
| `@Body()` | Reads the JSON request body. |
| `@Param('id')` | Reads a value from the URL. |
| `@CurrentUser()` | Custom decorator that reads the JWT user. |

### Validation decorators

| Decorator | Meaning |
| --- | --- |
| `@IsEmail()` | Requires a valid email. |
| `@IsString()` | Requires text. |
| `@IsUUID('4')` | Requires a version 4 UUID. |
| `@IsNumber()` | Requires a number. |
| `@IsPositive()` | Requires a number above zero. |
| `@IsOptional()` | Allows the field to be missing. |
| `@IsIn(list)` | Requires one value from a fixed list. |
| `@MinLength()` | Sets minimum text length. |
| `@MaxLength()` | Sets maximum text length. |
| `@Max()` | Sets a maximum number. |

### Transform decorators

| Decorator | Meaning |
| --- | --- |
| `@Transform()` | Runs custom code to clean or change a value. |
| `@Type(() => Number)` | Converts a value into a number. |

### Swagger decorators

Swagger decorators create API documentation. They do not perform the main business work.

| Decorator | Meaning |
| --- | --- |
| `@ApiTags()` | Groups routes in Swagger. |
| `@ApiBearerAuth()` | Shows that a bearer token is needed. |
| `@ApiOperation()` | Adds a route summary. |
| `@ApiProperty()` | Documents a DTO or entity field. |
| `@ApiPropertyOptional()` | Documents an optional field. |
| `@ApiOkResponse()` | Documents a 200 response. |
| `@ApiCreatedResponse()` | Documents a 201 response. |
| `@ApiBadRequestResponse()` | Documents a 400 response. |
| `@ApiUnauthorizedResponse()` | Documents a 401 response. |
| `@ApiNotFoundResponse()` | Documents a 404 response. |
| `@ApiConflictResponse()` | Documents a 409 response. |

## 16. TypeScript syntax used in the project

### `private readonly`

```ts
constructor(private readonly prisma: PrismaService) {}
```

- `private`: only this class can use it.
- `readonly`: it cannot be replaced after construction.

### `async` and `await`

Database and network calls take time.

`async` makes a function return a promise.

`await` waits for that promise to finish.

### `Promise<Type>`

```ts
Promise<AccountResponseDto>
```

This means the function will later return an `AccountResponseDto`.

### Generics with `< >`

```ts
configService.get<string>('JWT_SECRET')
```

`<string>` tells TypeScript what kind of value is expected.

### Optional field `?`

```ts
description?: string;
```

The field may be missing.

### Union type `|`

```ts
string | null
```

The value can be a string or `null`.

### Nullish fallback `??`

```ts
correctedCategory ?? category
```

Use `category` only when `correctedCategory` is missing.

### Spread `...`

```ts
return {
  ...account,
  balance: account.balance.toFixed(2),
};
```

This copies every account property, then replaces `balance` with a formatted string.

### `as const`

This tells TypeScript that values are fixed exact values.

It is useful for category lists and Prisma select objects.

### `keyof typeof`

This creates a type from the keys of an existing object.

The project uses it to keep category conversions type-safe.

### Template string

```ts
`Category is already ${dto.category}`
```

Backticks allow values inside `${...}`.

### Arrow function

```ts
(transaction) => this.toEntity(transaction)
```

This is a short function.

### `Map`

A `Map` stores key-value pairs.

Insights use category or month as the key and Decimal total as the value.

### `reduce()`

`reduce()` combines an array into one result.

The app uses it to calculate total spending and find the largest transaction.

### `try`, `catch`, and `throw`

- `try`: run code that may fail.
- `catch`: handle the failure.
- `throw`: stop and send an error upward.

NestJS exceptions such as `NotFoundException` already contain an HTTP status code.

## 17. Main HTTP status codes

| Code | Meaning in this app |
| --- | --- |
| `200` | Request worked, including an idempotent replay. |
| `201` | New user was created. |
| `400` | Invalid input, self-transfer, or insufficient balance. |
| `401` | Missing, expired, or invalid login token. |
| `404` | User, account, recipient, or transaction was not found. |
| `409` | Duplicate email, key ownership issue, or database conflict. |
| `500` | Unexpected server error. |
| `503` | Gemini is unavailable when no fallback handles it. |

## 18. Full endpoint list

| Method | Route | Protected | Main files |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | No | Auth controller and service |
| `POST` | `/auth/login` | No | Auth controller and service |
| `GET` | `/users/me` | Yes | Users controller and service |
| `GET` | `/accounts/me` | Yes | Accounts controller and service |
| `POST` | `/transfers` | Yes | Transfers controller and service |
| `GET` | `/transfers` | Yes | Transfers controller and service |
| `GET` | `/transactions` | Yes | Transactions controller and service |
| `PATCH` | `/transactions/:id/category` | Yes | Transactions controller and service |
| `GET` | `/insights` | Yes | Insights controller, service, and AI service |
| `GET` | `/health` | No | App controller |

## 19. Three complete examples

### Register example

```text
POST /auth/register
    ↓
RegisterDto cleans and validates the body
    ↓
AuthController.register()
    ↓
AuthService.register()
    ↓
bcrypt hashes the password
    ↓
Prisma creates User + Account
    ↓
JwtService signs a token
    ↓
201 response
```

### Transfer example

```text
POST /transfers
    ↓
JWT guard checks the token
    ↓
CreateTransferDto validates the body
    ↓
TransfersController.create()
    ↓
TransfersService checks the key and accounts
    ↓
Prisma transaction locks both accounts
    ↓
Balance check
    ↓
Debit sender + credit receiver
    ↓
Create transfer + debit record + credit record
    ↓
Database commit
    ↓
Background Gemini categorization
    ↓
200 response
```

### Category correction example

```text
PATCH /transactions/:id/category
    ↓
JWT guard checks the token
    ↓
UUID pipe checks the URL ID
    ↓
CorrectCategoryDto checks the category
    ↓
Service checks transaction ownership
    ↓
Create CategoryCorrection row
    ↓
Update correctedCategory
    ↓
Future Gemini prompts use this correction
```

## 20. Best reading order inside VS Code

Open these files in this order:

1. `src/main.ts`
2. `src/app.module.ts`
3. `src/auth/auth.controller.ts`
4. `src/auth/auth.service.ts`
5. `src/prisma/schema.prisma`
6. `src/accounts/accounts.controller.ts`
7. `src/accounts/accounts.service.ts`
8. `src/transfers/dto/create-transfer.dto.ts`
9. `src/transfers/transfers.controller.ts`
10. `src/transfers/transfers.service.ts`
11. `src/transactions/transactions.service.ts`
12. `src/ai/gemini.service.ts`
13. `src/ai/categorization.service.ts`
14. `src/ai/ai.service.ts`
15. `src/insights/insights.controller.ts`

For each feature, use this pattern:

```text
Module → Controller → DTO → Service → Entity
```

The controller tells you which endpoint exists. The DTO tells you what data enters. The service tells you what happens. The entity tells you what comes back.
