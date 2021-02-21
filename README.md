# Тестовый проект
## "Микросервис для хранения изображений"
### Для реализации использовал :
- **NodeJS**
- **Express**
- **MongoDB** (Docker)
- **mongoose** - для работы с MongoDB
- **argon2** - для хешей
- **jsonwebtoken** - генерация JWT токена
- **uuid** - для генерации уникальных ИД
- **multer** - для загрузки/обработки файлов
- **image-size** - для получения резмеров изображения
- **jimp** - для ресайза

**P.S.** В качестве хранения данных для изображений используется MongoDB. Для того чтобы по быстрому развернуть mongo базу - в корне проекта есть Docker-compose файл `docker-compose.yml` с простым конфигом.
Если нет Докера то пора установить [сам докер](https://docs.docker.com/engine/install/) и [compose](https://docs.docker.com/compose/install/).
Для запуска в корне выполнить комманду: `docker-compose up`
- [http://localhost:8081](http://localhost:8081) админка для mongo
- порт mongo стандартный - `27017`
- строка для подключения `mongodb://root:example@localhost/images?authSource=admin`

Данные о пользователе для авторазации лежат прямо в файле `auth.js` в массиве USERS.

Данные для авторизации:
```
{
  "login": "user",
  "password": "12345"
}
```
### Установка & Запуск
1. `git clone https://github.com/jsksru/img-store.git`
2. `cd img-store`
3. `npm install`
4. `npm start`

### Файл Конфигурации `config.js` :
- `port` (number) - Порт на котором работает API
- `prefix` string - Префикс API для запросов
- `secret` string - ключ сервера для шифрования JWT токена,
- `uploadDir` string - папка для хранения изображений,
- `allowTypes` array(string) - разрешенные к загрузке mime-типы файлов
- `maxSize` number - Максимально допустимый размер файла в байтах
- `dimensions` array(object) - массив вариантов изображения:
  ```
  {
    fileName: название файла (string eng filename)
    maxWidth: максимальная ширина в px,
    maxHeight: максимальная высота в px,
  }
  ```
