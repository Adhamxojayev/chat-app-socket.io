create database chat_app;


create table users(
    user_id serial primary key,
    name varchar(30) not null,
    password varchar(60) not null,
    unique(name)
);

create table message (
    id int not null references users(user_id),
    message_id serial,
    message varchar(444) not null,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



insert into users (name, password) values
('ahror', '1111'),
('umar', '0000');

select 
    u.name,
    m.message,
    m.created_at as date
from message m
join users u on u.user_id = m.id;  



select
    *
from users u
where u.name = 'ahror' and u.password = '1111';    



select 
    u.name,
    m.message,
    m.created_at as date
from users u
join message m on m.id = u.user_id
order by message_id desc    
limit 1;

