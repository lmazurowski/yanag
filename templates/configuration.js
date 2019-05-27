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
        'axios',
        'cookie-parser',
        'dotenv',
        'debug',
        'express',
        'prettier'
      ],
      devDependencies: [
        '@types/express',
        '@types/node',
        '@types/jest',
        'jest',
        'nodemon',
        'ts-node',
        'ts-jest',
        'tslint',
        'tslint-config-airbnb',
        'typescript'
      ]
    }
};
