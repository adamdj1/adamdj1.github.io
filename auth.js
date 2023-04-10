/* Schematize_auth.mjs 0.1.0 */
const _encodeURIComponent = encodeURIComponent;

const _Error = Error;

const _JSON = JSON;

const _JSON_stringify = _JSON.stringify;

const _JSON_parse = _JSON.parse;

const _undefined = undefined;

const _window = window;

const _window_location = _window.location;

const _sessionStorage = sessionStorage;

const uint8ArrayToString = (uint8Array) => (
  String.fromCharCode.apply(null, uint8Array)
);
const stringToUint8Array = (str) => {
  let uint8Array = new Uint8Array(str.length);
  for (let i = 0, il = str.length; i < il; i++) {
    uint8Array[i] = str.charCodeAt(i);
  }
  return uint8Array;
};
const toBase64WithoutPadding = (str) => (
  // base64 encode the string
  _window.btoa(str)
  // then replace a couple characters as it states here:
  // https://datatracker.ietf.org/doc/html/rfc7636#appendix-A
  // Remove any trailing '='s
  .replace(/=/g, '')
  // 62nd char of encoding
  .replace(/\+/g, '-')
  // 63rd char of encoding
  .replace(/\//g, '_')
);
const fromBase64WithoutPadding = (str) => (
  // base64 encode the string
  _window.atob(
    str
    // replace a couple characters as it states here:
    // https://datatracker.ietf.org/doc/html/rfc7636#appendix-A
    // 62nd char of encoding
    .replace(/-/g, '+')
    // 63rd char of encoding
    .replace(/_/g, '/')
  )
);

// request
// for network requests
const request = async (url, config) => {
  let response = await fetch(url, config);
  return await response.json();
};

// storage
// TODO: There are a ton of recommendations to NOT use localStorage, but to use
// something else.  I need to do more research on this and figure out why.
// For example: https://coolgk.medium.com/localstorage-vs-cookie-for-jwt-access-token-war-in-short-943fb23239ca
const storage = _sessionStorage;

// (typeof localStorage !== S_undefined) ?
// // use localStorage
// localStorage
// : 
// // user read/write api
// {
//   getItem: (name, value) => {
//     console.log('unimplemented');
//   },
//   setItem: (name) => {
//     console.log('unimplemented');
//   },
//   removeItem: (name) => {
//     console.log('unimplemented');
//   },
//   clear: (name) => {
//     console.log('unimplemented');
//   },
//   // key: () => {},
// };


// let auth = Schematize_auth({
//   authServer: 'https://schematize.internal:3000/auth/274376205836460032/',
//   // TODO: configure authServer endpoints (authorize endpoint, token endpoint, etc.)
//   // responseMode: 'query',
//   clientId: '274381130411827200',
//   scope: 'openid schematize',
//   responseType: 'code',
// });

// auth.authorize({
//   // responseMode: 'query',
//   // state: '',
// });

const Schematize_auth = (config) => {

  // validate the config that points to the correct server, etc.
  if (!config) {
    throw _Error('config not found');
  }

  // config.authServer
  // - required
  if (!config.authServer) {
    throw _Error('config.authServer required');
  }

  // config.clientId
  // - required
  if (!config.clientId) {
    throw _Error('config.clientId required');
  }

  // config.Instance 
  // - required
  if (!config.Instance) {
    throw _Error('config.Instance required');
  }
  const Instance = config.Instance;

  const PREFIX = 'Schematize_auth_';
  const ACCESS_TOKEN_NAME_POSTFIX = '_at';
  const ID_TOKEN_NAME_POSTFIX = '_id';
  const CODE_VERIFIER_POSTFIX = '_cv';
  const STATE_POSTFIX = '_s';

  // put together the storage key name
  const atStorageName = PREFIX + config.clientId + ACCESS_TOKEN_NAME_POSTFIX;
  const idStorageName = PREFIX + config.clientId + ID_TOKEN_NAME_POSTFIX;
  const cvStorageName = PREFIX + config.clientId + CODE_VERIFIER_POSTFIX;
  const sStorageName = PREFIX + config.clientId + STATE_POSTFIX;

  // "Schematize.Instance"
  let auth = new Instance(config);

  // authorized
  // - Boolean
  // - a flag that indicates whether the client is currently authorized to act
  //   on behalf of the user.
  auth.authorized;

  // accessToken
  // - String
  // - The accessToken string
  auth.accessToken;

  // headers
  // - Object
  // - an object that has headers for authorizing requests to other resources
  auth.headers;

  // userInfo
  // - Object
  // - an object containing information about the user.
  auth.userInfo;

  // error
  auth.error;

  // errorDescription
  auth.errorDescription;

  // errorUri
  auth.errorUri;

  // initialized
  // - Promise
  // - a promise used throughout the app to indicate that all of the async 
  //   checks have been completed to initialize the extension.
  auth.initialized;

  // init
  // 
  // init is really responsible for figuring out the "state" of authorization.
  // When it is called, it will figure out if there are any codes in the url, 
  // it will figure out if we already have any tokens stored, and then it will
  // make that information available to the other methods.
  //
  // TODO: One thing that i need to do is set a timer/interval to clear out the  
  // userInfo and headers and whatever else indicates that the app is
  // authorized.  This is because expiration can happen before a "page refresh"
  // happens and therefore this init function will not be called.
  auth.initialize = async () => {
    let 
      // _this = this,
      now = new Date().getTime() / 1000,
      creds,
      idToken,
      parts,
      payload,
      code, 
      error;

    // grab the code from the url if it is there...
    let searchParams;
    // query
    if (config.responseMode === 'query') {
      searchParams = new URLSearchParams(_window_location.search);
    // fragment
    } else {
      searchParams = new URLSearchParams(
        _window_location.hash.indexOf('#') === 0 ?
        _window_location.hash.substring(1) : 
        _window_location.hash
      );
    }

    // authorization_code grant
    // first, check if we got any codes in the url that we need to exchange for 
    // tokens...
    //--------------------------------------------------------------------------
    if (
      config.responseType === 'code' && 
      // see if there is a code in the hash params...
      (code = searchParams.get('code'))
    ) {

      // throw an error if we can't find the code_verifier
      let codeVerifier = storage.getItem(cvStorageName);
      // immediately remove it for security purposes
      storage.removeItem(cvStorageName);
      if (!codeVerifier) {
        throw _Error('code_verifier missing');
      }

      // get the state parameter
      let state = searchParams.get('state');
      // state = state ? window.atob(state) : 0;
      state = state ? fromBase64WithoutPadding(state) : 0;
      // get the state stored value
      let stateStored = storage.getItem(sStorageName);
      // immediately remove it for security purposes
      storage.removeItem(sStorageName);
      // stateStored = stateStored ? window.atob(stateStored) : 0;
      stateStored = stateStored ? fromBase64WithoutPadding(stateStored) : 0;
      // compare them to prevent against CSRF
      // SEE: https://datatracker.ietf.org/doc/html/rfc6749#section-10.12
      if (state !== stateStored) {
        throw _Error(`state values don't match`);
      }

      // exchange it
      let responseData = await request(
        `${config.authServer}oauth/token`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: _JSON_stringify({
            grant_type: 'authorization_code',
            client_id: config.clientId,
            code: code,
            code_verifier: codeVerifier,
            // state: '',
          })
        }
      );
      
      // if there are errors
      if (responseData.error) {
        auth.error = responseData.error;
        auth.errorDescription = responseData.error_description;
        auth.errorUri = responseData.error_uri;
        return;

      // if we received an access_token, we assume it was successful
      } else if (responseData.access_token) {

        // store the token for later use
        storage.setItem(atStorageName, _JSON_stringify({
          access_token: responseData.access_token,
          token_type: responseData.token_type,
          expires: (new Date().getTime() / 1000) + responseData.expires_in,
          scope: responseData.scope,
        }));

        // authorized
        auth.authorized = true;

        // make the accessToken available as well
        auth.accessToken = responseData.access_token;

        // allow the "crud" code to gain access to the token
        // TODO: This may not be exactly what we are looking for...figure out
        // the deliverable/end-result.
        auth.headers = new Instance({
          ['Authorization']: 'Bearer ' + auth.accessToken
        });

        // error 
        auth.error = _undefined;
        auth.errorDescription = _undefined;
        auth.errorUri = _undefined;

        // replace the code in the url
        // query
        if (config.responseMode === 'query') {
          // TODO: keep old query parameters and replace this with the old query parameters
          history.replaceState({}, document.title, _window_location.pathname);

        // fragment
        } else {
          // TODO: keep old hash value and replace this with the old hash value
          _window_location.hash = '';
        }
      }

      // if we received an id_token, we have to validate it...according to the
      // specification...which seems stupid, but it's what we have to do 
      // because this is the last stop for the id_token.  It isn't passed 
      // anywhere and so it must be validated to ensure that we aren't being
      // tricked into using someone else's userInfo.
      if (responseData.id_token) {
        let idToken = responseData.id_token;
        let throwError = () => {
          throw _Error('id_token invalid')
        };
        
        try {

          // First validate that it is a valid token using this documentation here:
          // https://datatracker.ietf.org/doc/html/rfc7519#section-7.2

          // 1. Verify that the JWT contains at least one period ('.')
          // character.
          let parts = idToken.split('.');
          if (parts.length !== 3) {
            throwError();
          }

          // 2. Let the Encoded JOSE Header be the portion of the JWT before the
          // first period ('.') character.
          // 3. Base64url decode the Encoded JOSE Header following the
          // restriction that no line breaks, whitespace, or other additional
          // characters have been used.
          // let header = window.atob(parts[0]);
          let header = fromBase64WithoutPadding(parts[0]);

          // 4. Verify that the resulting octet sequence is a UTF-8-encoded
          // representation of a completely valid JSON object conforming to
          // RFC 7159 [RFC7159]; let the JOSE Header be this JSON object.
          header = JSON.parse(header);

          // 5. Verify that the resulting JOSE Header includes only parameters
          // and values whose syntax and semantics are both understood and
          // supported or that are specified as being ignored when not
          // understood.
          if (
            // type header exists
            !header.typ ||
            // type is set to at+jwt...maybe this isn't accurate...
            header.typ !== 'at+jwt' ||
            // only algorithm that we can verify right now is RS256
            header.alg !== 'RS256' || 
            // key id exists
            !header.kid
          ) {
            throwError();
          }

          // 6. Determine whether the JWT is a JWS or a JWE using any of the
          // methods described in Section 9 of [JWE].
          // NOTE: We are assuming it's a JSW, not a JWE...

          // 7... If the JWT is a JWS, follow the steps specified in [JWS] for
          // validating a JWS.  Let the Message be the result of base64url
          // decoding the JWS Payload.
          // let payload = window.atob(parts[1]);
          let payload = fromBase64WithoutPadding(parts[1]);
          payload = JSON.parse(payload);

          // 8. If the JOSE Header contains a "cty" (content type) value of
          // "JWT", then the Message is a JWT that was the subject of nested
          // signing or encryption operations.  In this case, return to Step
          // 1, using the Message as the JWT.
          // NOTE: This is not the case...we aren't supporting this yet...
          
          // 9. Otherwise, base64url decode the Message following the
          // restriction that no line breaks, whitespace, or other additional
          // characters have been used.

          // 10.  Verify that the resulting octet sequence is a UTF-8-encoded
          // representation of a completely valid JSON object conforming to
          // RFC 7159 [RFC7159]; let the JWT Claims Set be this JSON object

          let signature = fromBase64WithoutPadding(parts[2]);

          // get the public key to verify the signature
          let key;
          let responseData = await request(
            `${config.authServer}oauth/.well-known/jwks.json`, {
              method: 'GET',
            }
          );
          if (
            !responseData ||
            !responseData.keys ||
            !(
              key = responseData.keys.find((k) => (
                k.kid === header.kid
              ))
            )
          ) {
            throwError();
          }

          // then verify the signature using crypto.subtle...
          // NOTE: This is seriously nuts, but it seems to actually work...
          if (
            !(
              await crypto.subtle.verify(
                // algorithm
                ({
                  'RS256': 'RSASSA-PKCS1-v1_5',
                })[header.alg], 
                // key
                await crypto.subtle.importKey(
                  // format
                  'jwk',
                  // keyData
                  key,
                  // algorithm
                  ({
                    'RS256': {
                      name: 'RSASSA-PKCS1-v1_5',
                      hash: 'SHA-256',
                    },
                  })[header.alg],
                  // extractable
                  false,
                  // keyUsages
                  key.key_ops
                ),
                // signature
                stringToUint8Array(signature), 
                // data
                stringToUint8Array(parts[0] + '.' + parts[1])
              )
            )
          ) {
            throwError();
          }

          // Finally validate the rest of the parts using this documentation here: 
          // https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.3.1.3.7

          // 1. If the ID Token is encrypted, decrypt it using the keys and
          // algorithms that the Client specified during Registration that
          // the OP was to use to encrypt the ID Token. If encryption was 
          // negotiated with the OP at Registration time and the ID Token is
          // not encrypted, the RP SHOULD reject it.

          // 2. The Issuer Identifier for the OpenID Provider (which is
          // typically obtained during Discovery) MUST exactly match 
          // the value of the iss (issuer) Claim.
          if (payload.iss !== config.authServer) {
            throwError();
          }

          // 3. The Client MUST validate that the aud (audience) Claim 
          // contains its client_id value registered at the Issuer 
          // identified by the iss (issuer) Claim as an audience. The 
          // aud (audience) Claim MAY contain an array with more than 
          // one element. The ID Token MUST be rejected if the ID Token 
          // does not list the Client as a valid audience, or if it 
          // contains additional audiences not trusted by the Client.
          if (payload.aud != config.clientId) {
            throwError();
          }

          // 4. If the ID Token contains multiple audiences, the Client 
          // SHOULD verify that an azp Claim is present.

          // 5. If an azp (authorized party) Claim is present, the Client 
          // SHOULD verify that its client_id is the Claim Value.

          // 6. If the ID Token is received via direct communication 
          // between the Client and the Token Endpoint (which it is in 
          // this flow), the TLS server validation MAY be used to 
          // validate the issuer in place of checking the token signature. 
          // The Client MUST validate the signature of all other ID 
          // Tokens according to JWS [JWS] using the algorithm specified 
          // in the JWT alg Header Parameter. The Client MUST use the
          // keys provided by the Issuer.
          // DONE

          // 7. The alg value SHOULD be the default of RS256 or the 
          // algorithm sent by the Client in the id_token_signed_response_alg
          // parameter during Registration.
          // DONE

          // 8. If the JWT alg Header Parameter uses a MAC based 
          // algorithm such as HS256, HS384, or HS512, the octets of 
          // the UTF-8 representation of the client_secret corresponding 
          // to the client_id contained in the aud (audience) Claim are 
          // used as the key to validate the signature. For MAC based 
          // algorithms, the behavior is unspecified if the aud is 
          // multi-valued or if an azp value is present that is different 
          // than the aud value.
          // N/A

          // 9. The current time MUST be before the time represented by 
          // the exp Claim.
          let now = (new Date().getTime() / 1000);
          if (payload.exp < now) {
            throwError();
          }

          // 10. The iat Claim can be used to reject tokens that were 
          // issued too far away from the current time, limiting the 
          // amount of time that nonces need to be stored to prevent 
          // attacks. The acceptable range is Client specific.
          if (payload.iat > now) {
            throwError();
          }

          // 11. If a nonce value was sent in the Authentication Request, 
          // a nonce Claim MUST be present and its value checked to 
          // verify that it is the same value as the one that was sent 
          // in the Authentication Request. The Client SHOULD check the 
          // nonce value for replay attacks. The precise method for 
          // detecting replay attacks is Client specific.
          // TODO: We should implement a nonce

          // 12. If the acr Claim was requested, the Client SHOULD check 
          // that the asserted Claim Value is appropriate. The meaning 
          // and processing of acr Claim Values is out of scope for this 
          // specification.
          // N/A

          // 13. If the auth_time Claim was requested, either through a 
          // specific request for this Claim or by using the max_age 
          // parameter, the Client SHOULD check the auth_time Claim 
          // value and request re-authentication if it determines too 
          // much time has elapsed since the last End-User authentication.
          // N/A

          // store user token in memory
          if (idToken) {
            auth.userInfo = new Instance(payload);
          }

          // store the token for later use
          storage.setItem(idStorageName, idToken);

        } catch (e) {
          console.error(e);
          console.error('id_token invalid');
          // throwError();

          // fallback on calling the getUserInfo() method to get the
          // user's information...this is a helpful fallback in cases
          // where the browser doesn't support everything here.
          auth.userInfo = await auth.getUserInfo();
        }
        
      }

    // This is an additional check here to ensure that we 
    // don't infinitiely redirect to the authServer?  This should 
    // save us from too much erroneous traffic...For example, if I see that 
    // there is an error in the url hash/fragment, don't redirect again...
    } else if (
      (error = searchParams.get('error'))
    ) {
      // TODO: Not sure if I need to do this...
      // auth.authorized = false;
      // auth.accessToken = undefined;
      // auth.headers = undefined;
      // auth.userInfo = undefined;
      auth.error = error;
      auth.errorDescription = searchParams.get('error_description') || '';
      auth.errorUri = searchParams.get('error_uri') || '';
    
    // previously stored valid tokens
    // second, check if we had anything in storage from a previous authorize 
    // flow.
    //--------------------------------------------------------------------------
    // TODO: One idea of how to ensure tokens weren't tampered with is to
    // include a "hash" or some kind of a "fingerprint" of some kind.  Still 
    // possible to tamper with, but might provide a little additional security.
    } else if (
      // check if the storage item is there
      (creds = storage.getItem(atStorageName)) && 
      // parse 
      (creds = _JSON_parse(creds)) &&
      // and the credentials have not expired yet
      (now < creds.expires) && 
      // we have an access_token
      (creds.access_token) &&
      // we have a scope 
      (creds.scope) && 
      // check whether this client was already granted access to all of the 
      // scopes that it wants
      // NOTE: config.scope is what the client wants...creds.scope is what the
      // client should already have access to.
      (
        config.scope.split(' ').every((s) => (
          creds.scope.split(' ').includes(s)
        ))
      )
      // meaning that we don't need to get more permissions by re-auth'ing
    ) {

      auth.authorized = true;
      auth.accessToken = creds.access_token;
      auth.headers = new Instance({
        ['Authorization']: 'Bearer ' + auth.accessToken
      });
      auth.error = _undefined;
      auth.errorDescription = _undefined;
      auth.errorUri = _undefined;

      // userInfo and the id_token
      if (
        // TODO: We assume the id token is still valid if it got stored, but
        // this is not a good assumption...we should still validate it 
        (idToken = storage.getItem(idStorageName)) && 
        (parts = idToken.split('.')) && 
        (parts.length === 3) && 
        // (payload = window.atob(parts[1])) &&
        (payload = fromBase64WithoutPadding(parts[1])) &&
        (payload = JSON.parse(payload))
      ) {
        auth.userInfo = new Instance(payload);
      } else {

        // fallback on calling the getUserInfo() method to get the
        // user's information...this is a helpful fallback in cases
        // where the browser doesn't support everything here.
        auth.userInfo = await auth.getUserInfo();

      }

    // if we got here, that indicates that the user has not authorized the 
    // client
    } else ;

  };

  // authorize
  // NOTE: This used to be called "signin", but it's better stated as 
  // "authorize" because this is really just authorizing a client to be able 
  // to act as the user...while it does include a step to sign in the user, 
  // signin may not even be part of this flow...
  auth.authorize = async function (options = {}) {

    // make sure we wait for the init function to run fully
    await auth.initialized;

    // the client is already authorized
    //-------------------------------------------------
    if (
      auth.authorized && 
      !options.force
    ) {
      return auth;

    // if there is an error...
    //-------------------------------------------------
    } else if (
      auth.error && 
      !options.force
    ) {

      // throw Error(
      console.error(
        'Authorization Failed\n' +
        auth.error + 
        (auth.errorDescription ? ` - ${auth.errorDescription}` : '') + 
        (auth.errorUri ? ` (${auth.errorUri})` : '')
      );
      return auth;

      // if we already tried for a token and it failed, don't try again for a
      // while...
      // if (tokenError) {
      //   return setTimeout(async () => {
      //     tokenError = 0;
      //     await auth.authorize(options);
      //   }, 10000);
      // }

    // otherwise redirect to the oauth/authorize url
    //-------------------------------------------------
    } else {

      // remove the storage if there is any
      storage.removeItem(atStorageName);
      storage.removeItem(idStorageName);

      //------------------------------------------------------------------------
      // PKCE - Proof Key for Code Exchange by OAuth Public Clients
      //------------------------------------------------------------------------
      // SEE: https://datatracker.ietf.org/doc/html/rfc7636
      let
        codeVerifier,
        codeChallenge,
        codeChallengeMethod;
        
      // code_verifier
      // SEE: https://datatracker.ietf.org/doc/html/rfc7636#section-4.1
      codeVerifier = 
      // 4) then base64 without padding
      toBase64WithoutPadding(
        // 3) convert it to a string
        uint8ArrayToString( 
          // 2) fill it with random bytes
          crypto.getRandomValues(
            // 1) create the Uint8Array
            new Uint8Array(32)
          )
          // testing
          // new Uint8Array([
          //   116, 24, 223, 180, 151, 153, 224, 37, 79, 250, 96, 125, 216, 173,
          //   187, 186, 22, 212, 37, 77, 105, 214, 191, 240, 91, 88, 5, 88, 83,
          //   132, 141, 121
          // ])
        )
      );
      // testing
      // console.log(codeVerifier === 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk');

      // code_challenge
      // SEE: https://datatracker.ietf.org/doc/html/rfc7636#section-4.2
      codeChallenge = 
      // 4) then base64 without padding
      toBase64WithoutPadding(
        // 3) convert the digest into a string
        uint8ArrayToString(
          // 3) convert ArrayBuffer back into a Uint8Array
          new Uint8Array(
            // 2) run it through a S256 digest (async)
            await crypto.subtle.digest(
              'SHA-256', 
              // 1) convert back to a Uint8Array so that we can 
              stringToUint8Array(codeVerifier)
            )
          )
        )
      );
      // testing
      // console.log(codeChallenge === 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM');

      // - code_challenge_method
      // https://datatracker.ietf.org/doc/html/rfc7636#section-4.3
      codeChallengeMethod = 'S256';

      // save the codeVerifier somewhere we can grab it later before we redirect
      storage.setItem(cvStorageName, codeVerifier);

      //------------------------------------------------------------------------
      // state
      //------------------------------------------------------------------------
      // REQUIRED for CSRF prevention
      if (options.state) {
        // options.state = window.btoa(options.state);
        options.state = toBase64WithoutPadding(options.state);
      } else {
        // options.state = window.btoa(
        options.state = toBase64WithoutPadding(
          uint8ArrayToString(
            // 2) fill it with random bytes
            crypto.getRandomValues(
              // 1) create the Uint8Array
              new Uint8Array(32)
            )
          )
        );
      }
      // store so that we can verify it later.
      storage.setItem(sStorageName, options.state);
      
      //------------------------------------------------------------------------
      // redirect to the authServer
      //------------------------------------------------------------------------
      let url = 
      `${config.authServer}oauth/authorize` +
      `?response_type=${_encodeURIComponent(config.responseType)}` + 
      `&client_id=${_encodeURIComponent(config.clientId)}` +
      `&scope=${_encodeURIComponent(config.scope)}` +
      `&redirect_uri=${_encodeURIComponent(options.redirectUri || _window_location.href)}` + 
      `&code_challenge=${codeChallenge}` + 
      `&code_challenge_method=${codeChallengeMethod}` +
      `&state=${_encodeURIComponent(options.state)}` +
      (config.responseMode ? `&response_mode=${_encodeURIComponent(config.responseMode)}` : ``);

      // send the browser to the oauth location to authorize
      _window_location.href = url;

      // return false so that applications know that there is an impending page
      // reload...
      // NOTE: This is because there is somewhat of a delay that will happen 
      // betwen setting the location.href and when the page unloads and 
      // refreshes.  Unfortunately javascript continues to process in between
      // this time and so we need an explicit signal to tell us to stop 
      // processing anything in between this time and the reload that would 
      // cause strange state oddities.
      return false;
    }
    
  };

  // signout
  // TODO: figure out if this is the correct way to say this...this might be 
  // better described as "unauthorize" or something stupid...
  auth.signout = async function (options = {}) {
    
    // make sure we wait for the init function to run fully
    await auth.initialized;

    // clear out and reset
    auth.authorized = false;
    auth.accessToken = _undefined;
    auth.headers = _undefined;
    auth.userInfo = _undefined;
    auth.error = _undefined;
    auth.errorDescription = _undefined;
    auth.errorUri = _undefined;

    // delete from storage
    storage.removeItem(atStorageName);
    storage.removeItem(idStorageName);
    
    
    // signout from the SSO
    // TODO: I'm not sure the job of this library is to signout the user...
    // it is only to authorize or unauthorize the client...not to give any 
    // abilities to signout the user...that is a function of the authServer
    // really...and this library is all about authenticating the client...
    // We can still remove the token information from localStorage, but we
    // don't really want to signout the user.

    //--------------------------------------------------------------------------
    // redirect to the authServer
    //--------------------------------------------------------------------------
    let url = 
    `${config.authServer}signout` +
    `?redirect_uri=${_encodeURIComponent(options.redirectUri || _window_location.href)}`;
    // `&client_id=${encodeURIComponent(config.clientId)}` +

    // redirect
    _window_location.href = url;

    // return false so that applications know that there is an impending page
    // reload...
    // NOTE: This is because there is somewhat of a delay that will happen 
    // betwen setting the location.href and when the page unloads and 
    // refreshes.  Unfortunately javascript continues to process in between
    // this time and so we need an explicit signal to tell us to stop 
    // processing anything in between this time and the reload that would 
    // cause strange state oddities.
    return false;

    // let responseData = await request(
    //   `${config.authServer}signout`, {
    //     method: 'GET',
    //     // headers: {
    //     //   'Content-type': 'application/json',
    //     // },
    //   }
    // );
  
    // if (responseData.error) {
    //   // TODO: figure out what we need to do
    //   console.error(responseData.error);
    // }
  };

  // getUserInfo
  auth.getUserInfo = async function () {

    // TODO: When should we expire this? 
    if (auth.userInfo) {
      return auth.userInfo;
    }

    // get profile information
    let responseData = await request(
      `${config.authServer}oauth/userinfo`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          // ...auth.headers,
          Authorization: auth.headers.Authorization,
        },
      }
    );
    
    // if there are errors
    if (responseData.error) {
      return console.error(responseData.error);
    }
    
    // if we received an access_token, we assume it was successful
    if (responseData) {
      auth.userInfo = new Instance(responseData);

      return responseData;
    }
  };

  // get the promise so that we wait for other actions if necessary
  // TODO: provide an option in the config to initialize the library manually.
  // For now we just do it automatically.
  auth.initialized = auth.initialize();

  return auth;
};

let auth = Schematize_auth({
        Instance: function (obj) {
          return obj;
        },
        authServer: "https://schematize.app/auth/433329539182387200/",
        clientId: "433330160845348864",
        scope: 'openid profile email schematize',
        responseType: 'code',
      });

export { auth };
