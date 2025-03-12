const bcrypt = require('bcrypt');
const validator = require('validator');
const createUser = require('../users/create');
const { v4: uuid } = require('uuid');

const { getRemoteAddress } = require('../../../utils/remoteAddress');

const Errors = {
  INVALID_CREDENTIALS: {
    invalidCredentials: 'Invalid credentials',
  },
  INVALID_EMAIL_OR_USERNAME: {
    invalidEmailOrUsername: 'Invalid email or username',
  },
  INVALID_PASSWORD: {
    invalidPassword: 'Invalid password',
  },
  USE_SINGLE_SIGN_ON: {
    useSingleSignOn: 'Use single sign-on',
  },
  INVALID_LDAP: {
    invalidLdap: 'Ldap authentication failed',
  },
};

const emailOrUsernameValidator = (value) =>
  value.includes('@')
    ? validator.isEmail(value)
    : value.length >= 3 && value.length <= 16 && /^[a-zA-Z0-9]+((_|\.)?[a-zA-Z0-9])*$/.test(value);

module.exports = {
  inputs: {
    emailOrUsername: {
      type: 'string',
      custom: emailOrUsernameValidator,
      required: true,
    },
    password: {
      type: 'string',
      required: true,
    },
    withHttpOnlyToken: {
      type: 'boolean',
      defaultsTo: false,
    },
  },

  exits: {
    invalidCredentials: {
      responseType: 'unauthorized',
    },
    invalidEmailOrUsername: {
      responseType: 'unauthorized',
    },
    invalidPassword: {
      responseType: 'unauthorized',
    },
    invalidLdap: {
      responseType: 'unauthorized',
    },
    useSingleSignOn: {
      responseType: 'forbidden',
    },
  },

  async fn(inputs) {
    let accessToken = '';
    let accessTokenPayload = null;
    const remoteAddress = getRemoteAddress(this.req);
    let user = await sails.helpers.users.getOneByEmailOrUsername(inputs.emailOrUsername);

    if (process.env.LDAP_SERVER_URL && ((user && user.isLdap) || !user)) {
      sails.log.info('AUTH mode : LDAP');

      const loginChain = inputs.emailOrUsername.split('@');
      const email = loginChain.length > 1 ? inputs.emailOrUsername : `${loginChain[0]}@example.com`;
      const login = loginChain[0];

      const success = await sails.helpers.utils.ldapAuthentificateUser(login, inputs.password);

      if (success) {
        if (!user) {
          await createUser.fn({
            email,
            password: '',
            isAdmin: false,
            isLdap: true,
            name: login,
            username: login,
            subscribeToOwnCards: false,
            createdAt: 'date',
            updatedAt: 'date',
          });
          user = await sails.helpers.users.getOneByEmailOrUsername(inputs.emailOrUsername);
        }

        const { token, payload } = sails.helpers.utils.createJwtToken(user.id);
        accessToken = token;
        accessTokenPayload = payload;
      }

      if (accessToken === '' || accessTokenPayload === null) {
        throw Errors.INVALID_LDAP;
      }
    } else {
      sails.log.info('AUTH mode : local');
      if (sails.config.custom.oidcEnforced) {
        throw Errors.USE_SINGLE_SIGN_ON;
      }

      if (!user) {
        sails.log.warn(
          `Invalid email or username: "${inputs.emailOrUsername}"! (IP: ${remoteAddress})`,
        );

        throw sails.config.custom.showDetailedAuthErrors
          ? Errors.INVALID_EMAIL_OR_USERNAME
          : Errors.INVALID_CREDENTIALS;
      }

      if (user.isSso) {
        throw Errors.USE_SINGLE_SIGN_ON;
      }

      if (!bcrypt.compareSync(inputs.password, user.password)) {
        sails.log.warn(`Invalid password! (IP: ${remoteAddress})`);

        throw sails.config.custom.showDetailedAuthErrors
          ? Errors.INVALID_PASSWORD
          : Errors.INVALID_CREDENTIALS;
      }

      const { token, payload } = sails.helpers.utils.createJwtToken(user.id);

      accessToken = token;
      accessTokenPayload = payload;
    }

    const httpOnlyToken = inputs.withHttpOnlyToken ? uuid() : null;

    await Session.create({
      accessToken,
      httpOnlyToken,
      remoteAddress,
      userId: user.id,
      userAgent: this.req.headers['user-agent'],
    });

    if (httpOnlyToken && !this.req.isSocket) {
      sails.helpers.utils.setHttpOnlyTokenCookie(httpOnlyToken, accessTokenPayload, this.res);
    }

    return {
      item: accessToken,
    };
  },
};
