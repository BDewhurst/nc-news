
exports.handleServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  };

  exports.routeNotFound = (req, res) => {
    res.status(404).send( {message: "No Path Found"} )
   }