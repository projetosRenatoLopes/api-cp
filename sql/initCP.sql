CREATE TABLE IF NOT EXISTS exactmeasure (
    uuid uuid DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE,
    createby VARCHAR NOT NULL,
    createdate VARCHAR NOT NULL,
    modifyby VARCHAR NOT NULL,
    modifydate VARCHAR NOT NULL,
    ordenation VARCHAR NOT NULL UNIQUE,
    PRIMARY KEY (uuid)
);

CREATE TABLE IF NOT EXISTS simplemeasure (
    uuid uuid DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE,
    typemeasure VARCHAR NOT NULL,
    quantity VARCHAR NOT NULL,
    createby VARCHAR NOT NULL,
    createdate VARCHAR NOT NULL,
    modifyby VARCHAR NOT NULL,
    modifydate VARCHAR NOT NULL,
    ordenation VARCHAR NOT NULL UNIQUE,
    PRIMARY KEY (uuid)
);


CREATE TABLE IF NOT EXISTS feedstock (
    uuid uuid DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE,
    measurement VARCHAR NOT NULL,
    quantity VARCHAR NOT NULL,
    price VARCHAR NOT NULL,
    createby VARCHAR NOT NULL,
    createdate VARCHAR NOT NULL,
    modifyby VARCHAR NOT NULL,
    modifydate VARCHAR NOT NULL,    
    PRIMARY KEY (uuid)
);


CREATE TABLE IF NOT EXISTS production (
    uuid uuid DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE,
    price VARCHAR NOT NULL,
    createby VARCHAR NOT NULL,
    createdate VARCHAR NOT NULL,
    modifyby VARCHAR NOT NULL,
    modifydate VARCHAR NOT NULL,    
    PRIMARY KEY (uuid)
);

CREATE TABLE IF NOT EXISTS feedstockused (
    uuid uuid DEFAULT uuid_generate_v4(),
    feedstockid VARCHAR NOT NULL,    
    quantity VARCHAR NOT NULL,    
    productionid VARCHAR NOT NULL,    
    PRIMARY KEY (uuid)
);

-- work packaging and others
CREATE TABLE IF NOT EXISTS wpo (
    uuid uuid DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE,    
    quantity VARCHAR NOT NULL,
    price VARCHAR NOT NULL,
    createby VARCHAR NOT NULL,
    createdate VARCHAR NOT NULL,
    modifyby VARCHAR NOT NULL,
    modifydate VARCHAR NOT NULL,    
    PRIMARY KEY (uuid)
);

CREATE TABLE IF NOT EXISTS wpoused (
    uuid uuid DEFAULT uuid_generate_v4(),
    wpoid VARCHAR NOT NULL,    
    quantity VARCHAR NOT NULL,    
    productionid VARCHAR NOT NULL,    
    PRIMARY KEY (uuid)
);

CREATE TABLE IF NOT EXISTS users (
    uuid uuid DEFAULT uuid_generate_v4(),
    nickname VARCHAR NOT NULL UNIQUE,
    name VARCHAR NOT NULL,
    pass VARCHAR NOT NULL,
    PRIMARY KEY (uuid)
);



INSERT INTO exactmeasure (name, createby, createdate, modifyby, modifydate, ordenation) values ('ml','system','1658766035713','system','1658766035713','0');
INSERT INTO exactmeasure (name, createby, createdate, modifyby, modifydate, ordenation) values ('gramas','system','1658766035713','system','1658766035713','1');
INSERT INTO exactmeasure (name, createby, createdate, modifyby, modifydate, ordenation) values ('unidade','system','1658766035713','system','1658766035713','2');

