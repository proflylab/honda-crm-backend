## Description

Honda CRM backend with Express web framework template

## Schema database

```sql
create table users
(
    id        int identity primary key,
    username  nvarchar(24) unique,
    password  nvarchar(60),
    firstName nvarchar(100),
    lastName  nvarchar(100),
    email     nvarchar(255),
    phone     nvarchar(15),
    role      nvarchar(15),
    createdAt datetime2 default getdate(),
    updatedAt datetime2 default getdate(),
    deletedAt datetime2
)
go

create table customers
(
    id          int identity primary key,
    name        nvarchar(100),
    lastName    nvarchar(100),
    type        int,

    phone       nvarchar(15),
    homePhone   nvarchar(15),
    officePhone nvarchar(15),
    remark      nvarchar(100),
    createdAt   datetime2 default getdate(),
    updatedAt   datetime2 default getdate(),
    deletedAt   datetime2
)
go

create table cars
(
    id            uniqueidentifier default newid(),
    customerId    int,
    model         nvarchar(100),
    year          int,
    chassisNumber nvarchar(100),
    plateNumber   nvarchar(100),
    description   nvarchar(100),
    createdAt     datetime2 default getdate(),
    updatedAt     datetime2 default getdate(),
    deletedAt     datetime2
)
go

create table customer_types
(
    id    int identity primary key,
    label nvarchar(100) unique
)
go
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/proflylab/express-template.git
```

Go to the project directory

```bash
  cd express-template
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

Deployment

```bash
  winsw install
  winsw start
```

## Authors

- [@Proflylab](https://www.github.com/proflylab)

## License
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
