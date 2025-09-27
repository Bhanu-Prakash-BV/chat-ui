Database Schema
Users Table
```
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    avatar VARCHAR(255) DEFAULT 'images/anon-avatar.png'
);
```
Messages Table
```
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INT,
    isActive BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```
Sample Data
```
INSERT INTO users (username, avatar) VALUES
('You', 'images/user-avatar.png'),
('Anonymous', 'images/anon-avatar.png'),
('Abhay Shukla', 'images/alice.png'),
```
```
INSERT INTO messages (message, user_id, isActive) VALUES
('Hello!', 1, 1),
('Hi Guyssss', 3, 0),
('We have Surprise For you!!', 2, 0);
```
Start the Node.js server:

```
cd backend
node server.js
```
