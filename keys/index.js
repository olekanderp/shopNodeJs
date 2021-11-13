// module.exports = {
//   MONGODB_URI: 'mongodb+srv://palan10:uKhrZ5Pkf0wvQcbr@cluster0.y2beu.mongodb.net/shop',
//   SESSION_SECRET: 'some text',
//   EMAIL_FROM: 'oleksanderp020895@gmail.com',
//   BASE_URL: 'http://localhost:3000'
// }

if(process.env.NODE_ENV === 'production'){
  module.exports = require('./key.prod')
}else {
  module.exports = require('./keys.dev')
}