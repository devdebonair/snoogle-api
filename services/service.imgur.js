const imgur = require('imgur');
const clientId = require("../config").imgur.clientId;
imgur.setClientId(clientId);

module.exports = imgur;
