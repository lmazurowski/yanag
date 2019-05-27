module.exports = {
    availableProjects: [
      'Express',
      'Nest'
    ],
    middlewares: [
      {
        name: 'MongoDB',
        dependencies: [
          '@types/mongodb',
          'mongodb'
        ]
      },
      {
        name: 'Redis',
        dependencies: [
          '@types/redis',
          'redis'
        ],
      },
      {
        name: 'ElasticSearch',
        dependencies: [
          '@types/elasticsearch',
          'elasticsearch',
        ],
      }
    ],
    express: {
      dependencies: [
        '@types/body-parser',
        '@types/cookie-parser',
        '@types/compression',
        '@types/debug',
        '@types/dotenv',
        '@types/errorhandler',
        '@types/express',
        '@types/express-flash',
        '@types/express-session',
        '@types/lusca',
        '@types/morgan',
        '@types/multer',
        '@types/passport',
        'axios',
        'body-parser',
        'cookie-parser',
        'compression',
        'chalk',
        'dotenv',
        'debug',
        'errorhandler',
        'express',
        'express-flash',
        'express-session',
        'express-status-monitor',
        'express-validator',
        'lusca',
        'morgan',
        'multer',
        'passport',
        'prettier'
      ],
      devDependencies: [
        '@types/node',
        '@types/jest',
        '@types/supertest',
        '@types/prettier',
        'jest',
        'nodemon',
        'ts-node',
        'ts-jest',
        'tslint',
        'tslint-config-airbnb',
        'typescript',
        'supertest'
      ]
    }
};
