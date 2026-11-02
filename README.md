# Проект Showcase

Проект-визитка о вымышленной игре с симуляцией матчей в отдельном сервисе.

URL: [skvigl.ru](https://skvigl.ru)

Архитектура: Каждый сервис в своём контейнере.

Stack: VDS, Nginx, Docker

## API

RESTful сервис для обработки данных о командах, игроках, турнирах и матчах.

URL: [api.skvigl.ru](https://api.skvigl.ru/docs/)

Архитектура: Routes -> Controllers -> Cache Layer (Redis) -> Services -> Repository -> Database

Routes - валидация DTO и JWT для защищённых маршрутов

Controllers - обработка HTTP-запросов и ответов

Redis - кеширование ответов на 30–60 секунд

Services - бизнес-логика приложения

Repository - работа с базой данных

Stack: NestJS, PostgreSQL, Redis, Swagger, JWT

## Simulator

Сервис симуляции матча по параметрам игроков.

Архитектура:

- Simulator-класс управляет процессом симуляции
- сервисы отвечают за обновление данных
- отдельные классы рассчитывают игровые события

Во время симуляции сервис генерирует события матча по минутам для логов, статистики и расчёта итогового результата

## Client

Веб-клиент для отображения информации.

Архитектура: App -> Components -> Shared

Stack: Next.js, Tailwind, SWR, Shadcn.

Оптимизация для SEO:

- Home: SSR + ISR
- Tournaments: SSR + ISR
- Tournament: SSR + ISR
- Teams: SSR + ISR
- Team: SSR + ISR
- Players: SSR + ISR
- Player: SSR + ISR
- Matches: SSR + ISR
- Match: SSR + ISR

## Admin

Кастомная CMS для управления сущностей проекта.

URL: [admin.skvigl.ru](https://admin.skvigl.ru)

Админ-панель открыта для демонстрации функционала CMS:

- Login: user@test.test
- Password: test1234!

Stack: Angular, Angular Material, RxJS
