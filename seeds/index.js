const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database connected')
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const randomPrice = Math.floor(Math.random() * 20) + 10
    const camp = new Campground({
      author: '60e74d2893af523274619d6b',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident alias, illum explicabo molestias, tempore harum animi temporibus odit asperiores dolore repudiandae dicta sapiente. Autem fugiat tempore exercitationem alias. Aliquam, laudantium?',
      price: randomPrice,
      images: [
        {
          url: 'https://res.cloudinary.com/dtwwscejc/image/upload/v1625935609/YelpCamp/wwepaivmf6ik4iwmogs7.jpg',
          filename: 'wwepaivmf6ik4iwmogs7',
        },
        {
          url: 'https://res.cloudinary.com/dtwwscejc/image/upload/v1625935609/YelpCamp/ceby5dsz2xlwskooyr7x.jpg',
          filename: 'ceby5dsz2xlwskooyr7x',
        },
      ],
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
