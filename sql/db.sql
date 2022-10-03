CREATE TABLE IF NOT EXISTS categories (
    ID SERIAL PRIMARY KEY,
    category VARCHAR(15) NOT NULL
);
CREATE TABLE IF NOT EXISTS  credits(
    ID SERIAL PRIMARY KEY,
    credit VARCHAR(15) NOT NULL
);
CREATE TABLE users(
    ID SERIAL PRIMARY KEY,
    first_name VARCHAR(15) NOT NULL,
    last_name VARCHAR(15) NOT NULL,
    code varchar(5),
    email text NOT NULL
);
CREATE TABLE expenses(
    ID SERIAL PRIMARY KEY,
    amount INT,
    date varchar(10),
    categories_id INT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(ID) ON DELETE CASCADE,
    FOREIGN KEY (categories_id) REFERENCES categories(ID) ON DELETE CASCADE
);

CREATE TABLE income(
    ID SERIAL PRIMARY KEY,
    amount INT,
    date varchar(10),
    credits_id INT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(ID) ON DELETE CASCADE,
    FOREIGN KEY (credits_id) REFERENCES credits(ID) ON DELETE CASCADE
);

INSERT INTO categories (category) VALUES 
('Travel'),
('Food'),
('Toiletries'),
('Communication');

INSERT INTO credits (credit) VALUES 
('Salary'),
('Savings');