exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({message : err.message})
  } else next(err)
}

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === '22P02' || err.code ==='23502' || err.code === '23503') {
    res.status(400).send({ message: 'Invalid input' });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err)
    res.status(500).send({ message: 'Internal Server Error' });
  } 

  exports.routeNotFound = (req, res) => {
    res.status(404).send( {message: "No Path Found"} )
   }