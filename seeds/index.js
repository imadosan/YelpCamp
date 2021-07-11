if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

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
    const name = `${sample(descriptors)} ${sample(places)}`
    const price = Math.floor(Math.random() * 20) + 10
    const location = `${cities[random1000].city}, ${cities[random1000].state}`
    const geoData = await geocoder
      .forwardGeocode({
        query: location,
        limit: 1,
      })
      .send()

    const camp = new Campground({
      // YOUR USER ID
      author: '60e74d2893af523274619d6b',
      title: name,
      location: location,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias magni distinctio porro, cum dicta perspiciatis nam? Ad maiores, nisi voluptatum obcaecati magni neque omnis ab et nobis amet molestias exercitationem.',
      price,
      geometry: geoData.body.features[0].geometry,
      images: [
        {
          url: 'https://res.cloudinary.com/dtwwscejc/image/upload/v1625935609/YelpCamp/wwepaivmf6ik4iwmogs7.jpg',
          filename: 'YelpCamp/hills_dflhtz',
        },
        {
          url: 'https://res.cloudinary.com/dtwwscejc/image/upload/v1625935609/YelpCamp/ceby5dsz2xlwskooyr7x.jpg',
          filename: 'YelpCamp/hills_dflhtz',
        },
      ],
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
