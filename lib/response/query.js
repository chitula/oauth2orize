var url = require('url')
  , AuthorizationError = require('../errors/authorizationerror');

/**
* Authorization Response parameters are encoded in the query string added to the redirect_uri when
* redirecting back to the Client.
**/
exports = module.exports = function (txn, res, params, next) {
  var parsed = url.parse(txn.redirectURI, true);
  delete parsed.search;
  Object.keys(params).forEach(function (k) {
    parsed.query[k] = params[k];
  });

  var location = url.format(parsed);
  // Don't use 3xx level redirects.
  // Instead, send redirectUrl in 2xx level response body, then redirect from within the client app.
  res.send(200, { redirectUrl: location });
  return next();
};

exports.validate = function(txn) {
  if (!txn.redirectURI) { throw new AuthorizationError('Unable to issue redirect for OAuth 2.0 transaction', 'server_error'); }
};
