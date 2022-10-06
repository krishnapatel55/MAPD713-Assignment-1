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

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all users in the system
server.get('/images', function (req, res, next) {
  //console.log('> Images GET: recieved request')

  requestCounterGET++;

  // Find every entity within the given collection
  ImagesSave.find({}, function (error, images) {
    //console.log('< Images GET: sending response')

    // Return all of the users in the system
    res.send(images)
  })
  console.log('Processed Request Count--> GET: %s, POST: %s',requestCounterGET,requestCounterPOST)
})


// Create a new user
server.post('/images', function (req, res, next) {

  requestCounterPOST++;

  // Make sure name is defined
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

  // Create the user using the persistence engine
  ImagesSave.create( newImage, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the user if no issues
    res.send(201, image)
  })
  console.log('Processed Request Count--> GET: %s, POST: %s',requestCounterGET,requestCounterPOST)
})


// Delete user with the given id
server.del('/images', function (req, res, next) {

  // Delete the user with the persistence engine
  ImagesSave.deleteMany({}, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
})
