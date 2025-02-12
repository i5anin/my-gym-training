Если тебе нужен **по-настоящему мощный и стильный backend**, который соответствует **современным стандартам** и **Чистому Коду**, то Express.js – это уже **морально устаревшее решение**.

---

### **🚀 Что выбрать вместо Express.js?**
👉 **NestJS** – это топовый фреймворк на TypeScript, построенный на **архитектуре, похожей на Angular**, с поддержкой **OOP, DI, модульности и мощного CLI**.

✅ **Преимущества NestJS:**
- **Модульность** (разделение логики по модулям).
- **Встроенная поддержка TypeORM, Prisma, Mongoose**.
- **Мгновенная генерация API** (OpenAPI/Swagger).
- **Декораторы для удобного контроля маршрутов и зависимостей**.
- **Гибкая поддержка WebSockets, GraphQL, gRPC**.
- **Встроенный DI (Dependency Injection)** – код **чистый и расширяемый**.

---

## **🔥 Переписываем всё на NestJS**

📌 **Структура проекта:**
```
📦 my-nest-app
 ┣ 📂 src
 ┃ ┣ 📂 workouts
 ┃ ┃ ┣ 📜 workouts.controller.ts
 ┃ ┃ ┣ 📜 workouts.service.ts
 ┃ ┃ ┣ 📜 workouts.module.ts
 ┃ ┣ 📂 database
 ┃ ┃ ┣ 📜 database.module.ts
 ┃ ┃ ┣ 📜 database.service.ts
 ┃ ┣ 📜 app.module.ts
 ┃ ┣ 📜 main.ts
 ┣ 📜 package.json
 ┣ 📜 tsconfig.json
```

---

### **📌 1. Установка NestJS**
```bash
npm i -g @nestjs/cli
nest new my-nest-app
cd my-nest-app
npm i @nestjs/config @nestjs/typeorm pg typeorm
```

---

### **📌 2. Настройка базы (`database.module.ts`)**
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
```

---

### **📌 3. Модель тренировки (`workout.entity.ts`)**
```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Workout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  workoutNumber: number;

  @Column()
  title: string;

  @Column()
  muscleGroup: string;

  @Column()
  exerciseType: string;

  @Column({ nullable: true })
  additionId: number;
}
```

---

### **📌 4. Сервис для работы с тренировками (`workouts.service.ts`)**
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workout } from './workout.entity';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutRepo: Repository<Workout>,
  ) {}

  async getAll(): Promise<Workout[]> {
    return this.workoutRepo.find();
  }

  async create(workoutData: Partial<Workout>): Promise<Workout> {
    const newWorkout = this.workoutRepo.create(workoutData);
    return this.workoutRepo.save(newWorkout);
  }
}
```

---

### **📌 5. Контроллер (`workouts.controller.ts`)**
```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { Workout } from './workout.entity';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get()
  getAll(): Promise<Workout[]> {
    return this.workoutsService.getAll();
  }

  @Post()
  create(@Body() workoutData: Partial<Workout>): Promise<Workout> {
    return this.workoutsService.create(workoutData);
  }
}
```

---

### **📌 6. Подключаем модули (`workouts.module.ts`)**
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';
import { Workout } from './workout.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workout])],
  controllers: [WorkoutsController],
  providers: [WorkoutsService],
})
export class WorkoutsModule {}
```

---

### **📌 7. Главный модуль (`app.module.ts`)**
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { WorkoutsModule } from './workouts/workouts.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, WorkoutsModule],
})
export class AppModule {}
```

---

### **📌 8. Запуск приложения (`main.ts`)**
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
```

---

### **🔥 Итог**
✅ **NestJS** даёт мощную, модульную, чистую архитектуру.  
✅ **DI (Dependency Injection)** делает код **чистым и расширяемым**.  
✅ **TypeORM** упрощает работу с базой.  
✅ **Swagger/OpenAPI** можно подключить **в одну строку**.  
✅ **Поддержка GraphQL/WebSockets/gRPC** на будущее.

---

### **📌 Запуск сервера**
```bash
npm run start
```

Теперь у тебя **самый крутой, чистый и мощный бэкенд** 🚀