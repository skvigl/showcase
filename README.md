# Проект Showcase

Это мой проект визитка о вымешленной игре с симуляцией матчей в отдельном сервисе.

Лайв: https://skvigl.ru

Архитектура: Каждый сервис в своём контенере.

Stack: VDS, Ngnix, Docker

## API

RESTful сервис для обработки данных о командах, игроках, событиев и матчей.

Swagger: https://skvigl.ru/api/v1/docs

Архитектура: Routes -> Redis -> Controllers -> Services -> Repository -> Database

Routes: Валидация входных и выходных данных согласно JSON schema. Валидация JWT для роутов под защитой.

Redis: Кеш ответов от сервиса на короткие сроки, 30-60 секунд

Controllers: Запрос данных из сервиса и возврат http ответов

Services: Бизнес логика над данными из репозитория

Repository: Запрос данных из базы данных проекта

Stack: Fastify, MySQL, Redis, Swagger, JWT, Typebox

## Simulator

Сервис симуляции матча по параметрам игроков.

Архитектура: Simulator класс использует сервисы для обновления данных и классы для симуляции матчей.

## Client

Веб клиент для отображения информации.

Архитектура: App -> Components -> Shared

Stack: Next.js, Tailwind, SWR, Shadcn.

Оптимизация для SEO:

- Home: SSR + ISR
- Events: SSR + ISR
- Event: SSR + ISR
- Teams: SSR + ISR
- Team: SSR + ISR
- Players: CSR
- Player: SSR + ISR
- Matches: CSR
- Match: CSR
