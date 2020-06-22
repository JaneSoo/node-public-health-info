const path = require('path');
// get health of application
exports.getHealth = (req, res) => {
  console.log('In controller - getHealth');
  res.status(200).sendFile(path.join(__dirname, '../views', 'health.html'));
  // res.json({
  //   status: 'UP',
  // });
};
