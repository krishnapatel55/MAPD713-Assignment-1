var SERVER_NAME = 'image-api'
var PORT = 5000;
var HOST = '127.0.0.1';

var requestCounterGET = 0;
var requestCounterPOST = 0;

var restify = require('restify')

  // Get a persistence engine for the images
  , ImagesSave = require('save')('images')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Endpoints: %s/images',server.url)
  console.log('Method: GET, POST') 
})

server
  // Allow the use of POST
  .use(restify.fullResponse())
  // Maps req.body to req.params
  .use(restify.bodyParser())

// Get all images
server.get('/images', function (req, res, next) {
    console.log('> Images GET: recieved request')

    requestCounterGET++;

    console.log('< Images GET: sending response')

    // Find every image in collection
    ImagesSave.find({}, function (error, images) {
      // Return all images
      res.send(images)
    })
  console.log('Processed Request Count--> GET: %s, POST: %s',requestCounterGET,requestCounterPOST)
})


// Create a new image
server.post('/images', function (req, res, next) {
  console.log('> Images POST: recieved request')

  requestCounterPOST++;

  // Input validation for each field
  if (req.params.imageId === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('ImageID must be supplied'))
  }
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Image Name must be supplied'))
  }
  if (req.params.url === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Image URL must be supplied'))
  }
  if (req.params.size === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Image Size must be supplied'))
  }
  var newImage = {
    imageId: req.params.imageId, 
    name: req.params.name, 
		url: req.params.url, 
		size: req.params.size
	}
  console.log('< Images POST: sending response')
  // Create image
  ImagesSave.create( newImage, function (error, image) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    // Send the image if no issues
    res.send(201, image)
  })
  console.log('Processed Request Count--> GET: %s, POST: %s',requestCounterGET,requestCounterPOST)
})

// Delete all images
server.del('/images', function (req, res, next) {
  console.log('> Images DELETE: recieved request')
  ImagesSave.deleteMany({}, function (error, image) {
    console.log('< Images DELETE: sending response')
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    res.send()
  })
})
