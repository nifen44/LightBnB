CREATE TABLE users(
	id SERIAL PRIMARY KEY NOT NULL,
	name VARCHAR(255),
	email VARCHAR(255),
	password VARCHAR(255),
);


CREATE TABLE properties(
	id SERIAL PRIMARY KEY NOT NULL,
	owner_id INTEGER REFERENCES users(id) on delete cascade
	title VARCHAR(255),
	description TEXT,
	thumbnail_photo_url VARCHAR(255),
	cover_photo_url VARCHAR(255),
	cost_per_night INTEGER,
	parking_spaces INTEGER,
	number_of_bathrooms INTEGER,
	number_of_bedrooms INTEGER,
	country VARCHAR(255),
	street VARCHAR(255),
	city VARCHAR(255),
	province VARCHAR(255),
	post_code VARCHAR(255),
	active BOOLEAN,
);

CREATE TABLE reservations(
	id SERIAL PRIMARY KEY NOT NULL,
	start_date DATE,
	end_date DATE,
	property_id INTEGER REFERENCES properties(id) on delete cascade,
	guest_id INTEGER REFERENCES users(id) on delete cascade
);

CREATE TABLE property_reviews(
	id SERIAL PRIMARY KEY NOT NULL,
	guest_id INTEGER REFERENCES users(id) on delete cascade,
	property_id INTEGER REFERENCES properties(id) on delete cascade,
	reservation_id INTEGER REFERENCES reservations(id) on delete cascade,
	rating SMALLINT,
	message TEXT
);