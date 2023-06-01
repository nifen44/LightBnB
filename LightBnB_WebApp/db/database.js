const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require('pg');

const pool = new Pool({
    user: 'vagrant',
    password: '123',
    host: 'localhost',
    database: 'lightbnb'
  });

  //pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => {})

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  // let resolvedUser = null;
  // for (const userId in users) {
  //   const user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     resolvedUser = user;
  //   }
  // }
  // return Promise.resolve(resolvedUser);

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
  //return Promise.resolve(users[id]);
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
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
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
  //return getAllProperties(null, 2);
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
  // const limitedProperties = {};
  // for (let i = 1; i <= limit; i++) {
  //   limitedProperties[i] = properties[i];
  // }
  // return Promise.resolve(limitedProperties);

  return pool.query(`select * from properties limit $1`, [limit])
  .then(result=>{
    return result.rows;
  })
  .catch(err=>{
    console.log(err.message);
  })
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
