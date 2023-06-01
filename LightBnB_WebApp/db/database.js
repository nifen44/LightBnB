const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require('pg');

const pool = new Pool({
    user: 'vagrant',
    password: '123',
    host: 'localhost',
    database: 'lightbnb'
  });

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool.query(`select * from users where email = $1`,[email])
  .then(result=>{
    if(result.rows.length === 0){
      return null;
    }else{
      return result.rows[0];
    }
  })
  .catch(err=>{
    console.log(err.message);
  })
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool.query(`select * from users where id = $1`,[id])
  .then(result=>{
    if(result.rows.length === 0){
      return null;
    }else{
      return result.rows[0];
    }
  })
  .catch(err=>{
    console.log(err.message);
  })
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  pool.query(`insert into users(name, email, password) values($1, $2, $3) returning *`, [`${user.name}`, `${user.email}`, `${user.password}`])
  .then(result=>{
    console.log(result);
  })
  .catch(err=>{
    console.log(err.message);
  })
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool.query(`select p.title, p.number_of_bedrooms, p.number_of_bathrooms, p.parking_spaces, pr.rating, p.cost_per_night, p.thumbnail_photo_url from reservations r inner join properties p on r.property_id = p.id inner join property_reviews pr on pr.reservation_id = r.id inner join users u on u.id = r.guest_id where r.guest_id = $1 limit $2`, [guest_id, limit])
  .then(result=>{
    return result.rows;
  })
  .catch(err=>{
    console.log(err.message);
  })
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  //return pool.query(`select * from properties limit $1`, [limit])

  // return pool.query(`SELECT p.id, p.owner_id, p.title, p.cost_per_night, avg(pr.rating) as average_rating FROM properties p LEFT JOIN property_reviews pr ON p.id = pr.property_id WHERE city LIKE $1 and p.cost_per_night >= $2 and p.cost_per_night <= $3 GROUP BY p.id HAVING avg(pr.rating) >= $4 ORDER BY p.cost_per_night LIMIT $5;`, [`%${options.city}%`, `${Number(options.minimum_price_per_night)}`, `${Number(options.maximun_price_per_night)}`, `${Number(options.minimun_rating)}`, limit])
  // .then(result=>{
  //   return result.rows;
  // })
  // .catch(err=>{
  //   console.log(err.message);
  // })

  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT p.*, avg(pr.rating) as average_rating
  FROM properties p
  LEFT JOIN property_reviews pr ON p.id = pr.property_id WHERE 1 = 1 
  `;
  
  // 3
  if(options.owner_id){
    queryParams.push(`${options.owner_id}`);
    queryString += `AND p.owner_id = $${queryParams.length} `;
  }

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `AND p.city LIKE $${queryParams.length} `;
  }

  if(options.minimum_price_per_night){
    queryParams.push(`${options.minimum_price_per_night*100}`);
    queryString += `AND p.cost_per_night >= $${queryParams.length} `;
  }

  if(options.maximum_price_per_night){
    queryParams.push(`${options.maximum_price_per_night*100}`);
    queryString += `AND p.cost_per_night <= $${queryParams.length} `;
  }

  if(options.minimun_rating){
    queryParams.push(`${options.minimun_rating}`);
    queryString += `AND pr.rating >= $${queryParams.length} `;
  }

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY p.id
  ORDER BY p.cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);

  console.log(property);

  return pool.query(`insert into properties(owner_id, title, description, number_of_bedrooms, number_of_bathrooms, parking_spaces, cost_per_night, thumbnail_photo_url, cover_photo_url, street, country, city, province, post_code) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) returning *`, [`${property.owner_id}`, `${property.title}`, `${property.description}`, `${property.number_of_bedrooms}`, `${property.number_of_bathrooms}`, `${property.parking_spaces}`, `${property.cost_per_night}`, `${property.thumbnail_photo_url}`, `${property.cover_photo_url}`, `${property.street}`, `${property.country}`, `${property.city}`, `${property.province}`, `${property.post_code}`])
  .then(result=>{
    console.log(result);
  })
  .catch(err=>{
    console.log(err.message);
  })

};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
