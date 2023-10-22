# Blog App
Blog app assignment.

# Author Endpoints
## Authentication

1. **POST /auth/author/signup**
   - Get username and password from the request body and adds the author in the 'authors' collection.
   - Password will be stored in database in hashed form(using bcrypt).
   - Returns a 200 OK status response if the author is successfully signed up.

   ```json
   {
     "name": "test",
     "email": "test@test.com",
     "password": "123456789"
   }
   ```

2. **POST /auth/author/login**
   - Get username and password from the request body and searches the author in the 'authors collection'.
   - Returns a 200 OK status response when author is successfully logged in.
   - Returns cookies login with value of JWT token and username with username of user.

   ```json
   {
    "email":"test@test.com",
    "password":"123456789"
   }
   ```

3. **POST /author/blog/new**
   - Get title and content body of blog from the request body and posts it to 'blogs' collection along with 'authorId' in the document.
   - Returns a 200 OK status response when blog is successfully .
   - Returns cookies login with value of JWT token and username with username of user.

   ```json
   {
      "title":"BLOG TITLE",
      "content":"BLOG CONTENT"
   }
   ```

## User Endpoints
### Authentication

1. **POST /auth/user/signup**
   - Get username and password from the request body and adds the user in the 'users' collection.
   - Password will be stored in database in hashed form(using bcrypt).
   - Returns a 200 OK status response if the user is successfully signed up.

    ```json
   {
     "name": "test",
     "email": "test@test.com",
     "password": "123456789"
   }
   ```

2. **POST /auth/user/login**
   - Get username and password from the request body and searches the user in the database.
   - Returns a 200 OK status response when user is successfully logged in.
   - Returns cookies login with value of JWT token and username with username of user.

    ```json
   {
     "email": "test@test.com",
     "password": "123456789"
   }
   ```

### Operations

All the routes other than /auth are protected with userProtect controller.

1. **GET user/blogs**
   - Returns JSON which contains array of blogs with each blog having author, title and content.

2. **GET blog/:id**
   - Returns JSON which contains the blog with the ID specified in URL parameter.
   - Blog consists of authorId, title, content and array of comments on blog.

3. **POST blog/:id**
   - Get comment from the request body and searches the user in the database.
   - Returns a 200 OK status response when comment is successfullt posted.

## Postman Collection

[https://www.postman.com/munishrukhaya/workspace/blog-app-assignment/collection/30129538-9e942329-2dda-42db-ab8b-8c906febc502?action=share&creator=30129538]
