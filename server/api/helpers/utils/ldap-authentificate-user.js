const ldap = require('ldapjs');
const fs = require('fs');
const path = require('path');

// load certs from env (LDAP_CA_CERT_PATHS=file1.pem,file2.pem)
// const caCertPaths = process.env.LDAP_CA_CERT_PATHS ? process.env.LDAP_CA_CERT_PATHS.split(',') : [];
// const caCerts = caCertPaths
//   .map((path) => {
//     try {
//       return fs.readFileSync(path.trim()); // trim() удаляет пробелы
//     } catch (err) {
//       sails.log.error(`Error reading CA certificate from ${path}: ${err}`);
//       return null; // Или бросить исключение, в зависимости от вашей логики
//     }
//   })
//   .filter((cert) => cert !== null); // Фильтруем null значения, если чтение не удалось

// load certs from dir
const caCertDir = process.env.LDAP_CA_CERT_DIR;
let caCerts = [];

if (caCertDir) {
  try {
    const files = fs.readdirSync(caCertDir);

    caCerts = files
      .filter((file) => file.endsWith('.pem') || file.endsWith('.crt')) // Фильтруем только .pem и .crt файлы
      .map((file) => {
        const fullPath = path.join(caCertDir, file);
        try {
          return fs.readFileSync(fullPath);
        } catch (err) {
          sails.log.error(`Error reading CA certificate from ${fullPath}: ${err}`);
          return null;
        }
      })
      .filter((cert) => cert !== null);
  } catch (err) {
    sails.log.error(`Error reading directory ${caCertDir}: ${err}`);
  }
}

const ldapOptions = {
  url: `${process.env.LDAP_SERVER_URL}`,
  tlsOptions: {
    ca: caCerts,
  },
};

module.exports = {
  inputs: {
    username: {
      type: 'string',
      required: true,
    },
    password: {
      type: 'string',
      required: true,
    },
  },

  async fn(inputs) {
    return new Promise((resolve) => {
      const { username, password } = inputs;
      const userDN = `uid=${username},${process.env.LDAP_BASE_DN}`;
      const client = ldap.createClient(ldapOptions);

      client.bind(userDN, password, (err) => {
        if (err) {
          sails.log.error(`Authentication failed for ${username}: ${err}`);
          client.unbind((unbindErr) => {
            if (unbindErr) {
              sails.log.error(`Unbind error: ${unbindErr}`);
            }
            resolve(false);
          });
          return;
        }

        sails.log.info(`Authentication successful for ${username}`);
        client.unbind((unbindErr) => {
          if (unbindErr) {
            sails.log.error(`Unbind error: ${unbindErr}`);
            resolve(true);
            return;
          }
          resolve(true);
        });
      });

      client.on('error', (err) => {
        sails.log.error(`Client error: ${err}`);
        resolve(false);
      });
    });
  },
};
