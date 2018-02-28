var url = require('url')
  , qs = require('querystring')
  , AuthorizationError = require('../errors/authorizationerror');

/**
* Authorization Response parameters are encoded in the fragment added to the redirect_uri when
* redirecting back to the Client.
**/
exports = module.exports = function (txn, res, params) {
  var parsed = url.parse(txn.redirectURI);
  parsed.hash = qs.stringify(params);

  var location = url.format(parsed);
  // Don't use 3xx level redirects.
  // Instead, send redirectUrl in 2xx level response body, then redirect from within the client app.
  res.send(200, { redirectUrl: location });
  return next();
};


exports.validate = function(txn) {
  if (!txn.redirectURI) { throw new AuthorizationError('Unable to issue redirect for OAuth 2.0 transaction', 'server_error'); }
};
