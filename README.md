# Тестовый проект
## "Микросервис для хранения изображений"
### Для реализации использовал :
- **NodeJS**
- **Express**
- **MongoDB** (Docker)
- **worker_threads** - воркеры из комплекта NodeJS
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

### Описание API :

- #### `POST: /api/v1/login`
  Логин в систему (получение JWT токена).
  Body:
  ```
  {
    "username": "user",
    "password": "12345"
  }
  ```
  username/password - данныее пользователя прописаны в `auth.controller.js` в массиве `USERS` в реале берутся из базы.
  Успешный ответ:
  ```
  {
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYxMzU1NDk2NX0.li-n9KTgee7jjlFJLieSh6w1BuQwoviosgSMJQQona4"
  }
  ```
- #### `POST: /api/v1/upload`
  Загрузка изображения.
  При валидном токене принимает один файл допустимого mime-типа и размера (настраивается в `config.js`).
  Ответ при удачной загрузке (статус 200):
  ```
  {
    "status": "uploaded",
    "imageId": "11ee8591-e141-4184-bf4f-8f5d0012d709"
  }
  ```
  После загрузки, в базу заносится информация о файле, а оригинал изображения попадает в очередь на обработку (нарезка разных размеров). В дальнейшем можно добавить сжатие, наложение ватермарка, и.т.п.. Обработка происходит в отдельном потоке, после обработки, оригинал переименовывается и запись в базе дополняется.
- #### `GET: /api/v1/image/:id`
  Получение информации об изображении.
  в качестве id в адресе нужно указать imageId картинки
  прим. - `/api/v1/image/11ee8591-e141-4184-bf4f-8f5d0012d709`
  Если изображение существует есть несколько вариантов ответа:
  - Изображение есть но оно еще не обработано:
  ```
  {
    "complete": false,
    "images": null,
    "_id": "6032338babeca92868b1721b",
    "imageId": "1ca046f9-3d8c-402a-949d-714f5edae357",
    "original": "82/1ca046f9-3d8c-402a-949d-714f5edae357/original.jpg",
    "uploaded": "2021-02-21T10:18:51.052Z",
    "__v": 0
  }
  ```
  - Изображение есть, оно обработано, но у пользователя нет токена (Гость):
  ```
  {
    "complete": true,
    "images": [
        {
            "size": "thumb",
            "src": "82/1ca046f9-3d8c-402a-949d-714f5edae357/thumb.jpg",
            "width": 50,
            "height": 31
        },
        {
            "size": "small",
            "src": "82/1ca046f9-3d8c-402a-949d-714f5edae357/small.jpg",
            "width": 150,
            "height": 94
        },
        {
            "size": "medium",
            "src": "82/1ca046f9-3d8c-402a-949d-714f5edae357/medium.jpg",
            "width": 500,
            "height": 313
        }
    ],
    "_id": "6032338babeca92868b1721b",
    "imageId": "1ca046f9-3d8c-402a-949d-714f5edae357",
    "original": null,
    "uploaded": "2021-02-21T10:18:51.052Z",
    "__v": 0
  }
  ```
  - Изображение есть, оно обработано, у пользователя есть валидный токен:
  ```
  {
    "complete": true,
    "images": [
        {
            "size": "thumb",
            "src": "82/1ca046f9-3d8c-402a-949d-714f5edae357/thumb.jpg",
            "width": 50,
            "height": 31
        },
        {
            "size": "small",
            "src": "82/1ca046f9-3d8c-402a-949d-714f5edae357/small.jpg",
            "width": 150,
            "height": 94
        },
        {
            "size": "medium",
            "src": "82/1ca046f9-3d8c-402a-949d-714f5edae357/medium.jpg",
            "width": 500,
            "height": 313
        }
    ],
    "_id": "6032338babeca92868b1721b",
    "imageId": "1ca046f9-3d8c-402a-949d-714f5edae357",
    "original": "82/1ca046f9-3d8c-402a-949d-714f5edae357/cf8ffc1d-33ad-4db8-803d-a07b076e1902.jpg",
    "uploaded": "2021-02-21T10:18:51.052Z",
    "__v": 0
  }
  ```

### Ошибки
При возникновении ошибки сервер отвечает соответсвующим статусом и ответом ввида:
```
{
  "error: true,
  "message": "текст ошибки"
}
```