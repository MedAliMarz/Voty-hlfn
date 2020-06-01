const openApiDoc = {
  openapi: '3.0.1',
  info: {
    version: '1.3.0',
    title: 'Voty API',
    description: 'Voty application APIs',
    termsOfService: 'http://api_url/terms/',
    contact: {
      name: 'Voty Team',
      email: 'admin@voty.com',
      url: 'https://www.voty.com/'
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
    }
  },
  servers: [
    {
      url: 'http://localhost:8081',
      description: 'Local server'
    },
    {
      url: 'https://api_url_production',
      description: 'Production server'
    }
  ],
  tags: [
    {
      name: 'Voters'
    },
    {
      name: 'Candidates'
    },
    {
      name: 'Admins'
    },
    {
      name: 'Elections'
    },
    {
      name: 'Voting'
    },
    {
      name: 'Auth'
    }
  ],
  paths: {
    '/election': {
      get: {
        security: [
          {
            bearerAuth: []
          }
        ],
        tags: ['Elections'],
        summary: 'Get elections',
        operationId: 'getElections',
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Elections'
                }
              }
            }
          },
          '500': {
            description: 'Problem in transaction',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  message: 'You are not allowed',
                  internal_code: 'ACLs'
                }
              }
            }
          },
          '403': {
            $ref: '#/components/responses/UnauthorizedError'
          },
          '401': {
            $ref: '#/components/responses/UnauthenticatedError'
          }
        }
      },
      post: {
        security: [
          {
            bearerAuth: []
          }
        ],
        tags: ['Elections'],
        summary: 'Create an election',
        operationId: 'createElection',
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Election'
                }
              }
            }
          },
          '404': {
            description: 'Admin email is incorrect',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '400': {
            description: 'You must supply all needed attributes',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '500': {
            description: 'Problem in transaction',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  message: 'You are not allowed',
                  internal_code: 'ACLs'
                }
              }
            }
          },
          '403': {
            $ref: '#/components/responses/UnauthorizedError'
          },
          '401': {
            $ref: '#/components/responses/UnauthenticatedError'
          }
        }
      }
    },
    'election/{id}': {
      get: {
        security: [
          {
            bearerAuth: []
          }
        ],
        tags: ['Elections'],
        summary: 'Get election by id',
        operationId: 'getElectionById',
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Election'
                }
              }
            }
          },
          '404': {
            description: 'Requested election not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '500': {
            description: 'Problem in transaction',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  message: 'You are not allowed',
                  internal_code: 'ACLs'
                }
              }
            }
          },
          '403': {
            $ref: '#/components/responses/UnauthorizedError'
          },
          '401': {
            $ref: '#/components/responses/UnauthenticatedError'
          }
        }
      },
      put: {
        security: [
          {
            bearerAuth: []
          }
        ],
        tags: ['Elections'],
        summary: 'Update an election',
        operationId: 'updateElection',
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Election'
                }
              }
            }
          },
          '400': {
            description: 'Bad request, election id is missing',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '500': {
            description: 'Problem in transaction',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  message: 'You are not allowed',
                  internal_code: 'ACLs'
                }
              }
            }
          },
          '403': {
            $ref: '#/components/responses/UnauthorizedError'
          },
          '401': {
            $ref: '#/components/responses/UnauthenticatedError'
          }
        }
      }
    },
    'election/{id}/voters': {
      get: {
        security: [
          {
            bearerAuth: []
          }
        ],
        tags: ['Elections'],
        summary: 'Get voters of an election',
        operationId: 'getElectionVoters',
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Voters'
                }
              }
            }
          },
          '404': {
            description: 'Requested election not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '500': {
            description: 'Problem in transaction',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  message: 'You are not allowed',
                  internal_code: 'ACLs'
                }
              }
            }
          },
          '403': {
            $ref: '#/components/responses/UnauthorizedError'
          },
          '401': {
            $ref: '#/components/responses/UnauthenticatedError'
          }
        }
      }
    },
    'election/{id}/candidates': {
      get: {
        security: [
          {
            bearerAuth: []
          }
        ],
        tags: ['Elections'],
        summary: 'Get candidates of an election',
        operationId: 'getElectionCandidates',
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Candidates'
                }
              }
            }
          },
          '404': {
            description: 'Requested election not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '500': {
            description: 'Problem in transaction',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  message: 'You are not allowed',
                  internal_code: 'ACLs'
                }
              }
            }
          },
          '403': {
            $ref: '#/components/responses/UnauthorizedError'
          },
          '401': {
            $ref: '#/components/responses/UnauthenticatedError'
          }
        }
      }
    },
    '/voter': {
      post: {
        security: [
          {
            bearerAuth: []
          }
        ],
        tags: ['Voters'],
        summary: 'Create a voter',
        operationId: 'createVoter',
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Voter'
                }
              }
            }
          },
          '404': {
            description: 'Admin email is not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '400': {
            description: 'You must supply all needed attributes',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '500': {
            description: 'Problem in transaction',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  message: 'You are not allowed',
                  internal_code: 'ACLs'
                }
              }
            }
          },
          '403': {
            $ref: '#/components/responses/UnauthorizedError'
          },
          '401': {
            $ref: '#/components/responses/UnauthenticatedError'
          }
        }
      }
    },
    '/voter/{id}': {
      get: {
        security: [
          {
            bearerAuth: []
          }
        ],
        tags: ['Voters'],
        summary: 'Get a voter by id',
        operationId: 'getVoterById',
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Voter'
                }
              }
            }
          },
          '404': {
            description: 'Requested voter id is not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '400': {
            description: 'Bad request, voter id is missing',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '500': {
            description: 'Problem in transaction',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  message: 'You are not allowed',
                  internal_code: 'ACLs'
                }
              }
            }
          },
          '403': {
            $ref: '#/components/responses/UnauthorizedError'
          },
          '401': {
            $ref: '#/components/responses/UnauthenticatedError'
          }
        }
      }
    },
    '/admin': {
      get: {
        security: [
          {
            bearerAuth: []
          }
        ],
        tags: ['Admins'],
        summary: 'Get admins',
        operationId: 'getAdmins',
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Admins'
                }
              }
            }
          },
          '500': {
            description: 'Problem in transaction',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  message: 'You are not allowed',
                  internal_code: 'ACLs'
                }
              }
            }
          },
          '403': {
            $ref: '#/components/responses/UnauthorizedError'
          },
          '401': {
            $ref: '#/components/responses/UnauthenticatedError'
          }
        }
      },
      post: {
        security: [
          {
            bearerAuth: []
          }
        ],
        tags: ['Admins'],
        summary: 'Create an admin',
        operationId: 'createAdmin',
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Admin'
                }
              }
            }
          },
          '404': {
            description: 'Admin registration failed',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '400': {
            description: 'You must supply all needed attributes',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '500': {
            description: 'Problem in transaction',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  message: 'You are not allowed',
                  internal_code: 'ACLs'
                }
              }
            }
          },
          '403': {
            $ref: '#/components/responses/UnauthorizedError'
          },
          '401': {
            $ref: '#/components/responses/UnauthenticatedError'
          }
        }
      }
    },
    '/admin/{id}': {
      get: {
        security: [
          {
            bearerAuth: []
          }
        ],
        tags: ['Admins'],
        summary: 'Get an admin by id',
        operationId: 'getAdminById',
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Admin'
                }
              }
            }
          },
          '404': {
            description: 'Requested admin email is not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '400': {
            description: 'Bad request, admin email is missing',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '500': {
            description: 'Problem in transaction',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  message: 'You are not allowed',
                  internal_code: 'ACLs'
                }
              }
            }
          },
          '403': {
            $ref: '#/components/responses/UnauthorizedError'
          },
          '401': {
            $ref: '#/components/responses/UnauthenticatedError'
          }
        }
      }
    },
    '/admin/{id}/elections': {
      get: {
        security: [
          {
            bearerAuth: []
          }
        ],
        tags: ['Admins'],
        summary: 'Get elections created by an admin',
        operationId: 'getAdminElections',
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Elections'
                }
              }
            }
          },
          '404': {
            description: 'Requested admin email is not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '400': {
            description: 'Bad request, admin email is missing',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '500': {
            description: 'Problem in transaction',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  message: 'You are not allowed',
                  internal_code: 'ACLs'
                }
              }
            }
          },
          '403': {
            $ref: '#/components/responses/UnauthorizedError'
          },
          '401': {
            $ref: '#/components/responses/UnauthenticatedError'
          }
        }
      }
    },
    '/candidate': {
      post: {
        security: [
          {
            bearerAuth: []
          }
        ],
        tags: ['Candidates'],
        summary: 'Create a candidate',
        operationId: 'createCandidate',
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Candidate'
                }
              }
            }
          },
          '400': {
            description: 'You must supply all needed attributes',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '500': {
            description: 'Problem in transaction',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  message: 'You are not allowed',
                  internal_code: 'ACLs'
                }
              }
            }
          },
          '403': {
            $ref: '#/components/responses/UnauthorizedError'
          },
          '401': {
            $ref: '#/components/responses/UnauthenticatedError'
          }
        }
      },
      put: {
        security: [
          {
            bearerAuth: []
          }
        ],
        tags: ['Candidates'],
        summary: 'Update candidacy',
        operationId: 'updateCandidacy',
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Candidate'
                }
              }
            }
          },
          '400': {
            description: 'Bad request, election id is missing',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '500': {
            description: 'Problem in transaction',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  message: 'You are not allowed',
                  internal_code: 'ACLs'
                }
              }
            }
          },
          '403': {
            $ref: '#/components/responses/UnauthorizedError'
          },
          '401': {
            $ref: '#/components/responses/UnauthenticatedError'
          }
        }
      }
    },
    '/candidate/{id}': {
      get: {
        security: [
          {
            bearerAuth: []
          }
        ],
        tags: ['Candidates'],
        summary: 'Get a candidate by id',
        operationId: 'getCandidateById',
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Candidate'
                }
              }
            }
          },
          '404': {
            description: 'Requested candidate is not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '400': {
            description: 'Bad request, candidate id is missing',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '500': {
            description: 'Problem in transaction',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  message: 'You are not allowed',
                  internal_code: 'ACLs'
                }
              }
            }
          },
          '403': {
            $ref: '#/components/responses/UnauthorizedError'
          },
          '401': {
            $ref: '#/components/responses/UnauthenticatedError'
          }
        }
      }
    },
    '/vote': {
      post: {
        security: [
          {
            bearerAuth: []
          }
        ],
        tags: ['Voting'],
        summary: 'Vote for a candidate',
        operationId: 'vote',
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Voter'
                }
              }
            }
          },
          '400': {
            description: 'You must supply all needed attributes',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '500': {
            description: 'Problem in transaction',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  message: 'You are not allowed',
                  internal_code: 'ACLs'
                }
              }
            }
          },
          '403': {
            $ref: '#/components/responses/UnauthorizedError'
          },
          '401': {
            $ref: '#/components/responses/UnauthenticatedError'
          }
        }
      }
    },
    '/login': {
      post: {
        tags: ['Auth'],
        summary: 'login to voty app',
        operationId: 'login',
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/securitySchemes/bearerAuth'
                }
              }
            }
          },
          '400': {
            description: 'You must supply all needed attributes',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '404': {
            description: 'Connection to network failed',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '500': {
            description: 'Problem in transaction',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  message: 'You are not allowed',
                  internal_code: 'ACLs'
                }
              }
            }
          }
        }
      }
    },
    '/logout': {
      post: {
        tags: ['Auth'],
        summary: 'logout of voty app',
        operationId: 'logout',
        responses: {
          '200': {
            description: 'Successful operation',
          },
          '401': {
            $ref: '#/components/responses/UnauthenticatedError'
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      voterId: {
        type: 'string',
        description: 'voter/candidate identifier',
        example: 'x9ZE123f0gl'
      },
      firstName: {
        type: 'string',
        example: 'joe'
      },
      lastName: {
        type: 'string',
        example: 'doe'
      },
      email: {
        type: 'string',
        format: 'email',
        example: 'joe_doe@gmail.com'
      },
      data: {
        type: 'string',
        example: 'aiming for a better future'
      },
      isCandidate: {
        type: 'boolean',
        example: true
      },
      hasVoted: {
        type: 'boolean',
        example: true
      },
      isActive: {
        type: 'boolean',
        example: false
      },
      type: {
        type: 'string',
        enum: ['admin','voter','candidate','superadmin']
      },
      votes: {
        type: 'integer',
        example: 1
      },
      electionId: {
        type: 'string',
        description: 'Election Id',
        example: 'xE03DFF413_Voty_Election2020'
      },
      name: {
        type: 'string',
        example: 'Voty_Election2020'
      },
      description: {
        type: 'string',
        example: 'Voty 2020 Election'
      },
      organisation: {
        type: 'string',
        example: 'Voty'
      },
      votersNumber: {
        type: 'integer',
        example: 0
      },
      candidacy_startDate: {
        type: 'string',
        format: 'date_time',
        example: '2020-05-21T8:00:00'
      },
      candidacy_endDate: {
        type: 'string',
        format: 'date_time',
        example: '2020-05-21T20:00:00'
      },
      voting_startDate: {
        type: 'string',
        format: 'date_time',
        example: '2020-06-21T8:00:00'
      },
      voting_endDate: {
        type: 'string',
        format: 'date_time',
        example: '2020-06-21T20:00:00'
      },
      state: {
        type: 'string',
        example: 'created'
      },
      Voter: {
        type: 'object',
        properties: {
          voterId: {
            $ref: '#/components/schemas/voterId'
          },
          electionId: {
            $ref: '#/components/schemas/electionId'
          },
          firstName: {
            $ref: '#/components/schemas/firstName'
          },
          lastName: {
            $ref: '#/components/schemas/lastName'
          },
          email: {
            $ref: '#/components/schemas/email'
          },
          data: {
            $ref: '#/components/schemas/data'
          },
          isCandidate: {
            $ref: '#/components/schemas/isCandidate'
          },
          hasVoted: {
            $ref: '#/components/schemas/hasVoted'
          },
          isActive: {
            $ref: '#/components/schemas/isActive'
          },
          type: {
            $ref: '#/components/schemas/type'
          },
          votes: {
            $ref: '#/components/schemas/votes'
          }
        }
      },
      Voters: {
        type: 'object',
        properties: {
          users: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Voter'
            }
          }
        }
      },
      Candidate: {
        type: 'object',
        properties: {
          voterId: {
            $ref: '#/components/schemas/voterId'
          },
          electionId: {
            $ref: '#/components/schemas/electionId'
          },
          firstName: {
            $ref: '#/components/schemas/firstName'
          },
          lastName: {
            $ref: '#/components/schemas/lastName'
          },
          email: {
            $ref: '#/components/schemas/email'
          },
          data: {
            $ref: '#/components/schemas/data'
          },
          isCandidate: {
            $ref: '#/components/schemas/isCandidate'
          },
          hasVoted: {
            $ref: '#/components/schemas/hasVoted'
          },
          isActive: {
            $ref: '#/components/schemas/isActive'
          },
          type: {
            $ref: '#/components/schemas/type'
          },
          votes: {
            $ref: '#/components/schemas/votes'
          }
        }
      },
      Candidates: {
        type: 'object',
        properties: {
          users: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Candidate'
            }
          }
        }
      },
      Admin: {
        type: 'object',
        properties: {
          firstName: {
            $ref: '#/components/schemas/firstName'
          },
          lastName: {
            $ref: '#/components/schemas/lastName'
          },
          email: {
            $ref: '#/components/schemas/email'
          },
          elections: {
            $ref: '#/components/schemas/Elections'
          },
          type: {
            $ref: '#/components/schemas/type'
          }
        }
      },
      Admins: {
        type: 'object',
        properties: {
          users: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Admin'
            }
          }
        }
      },
      Election: {
        type: 'object',
        properties: {
          electionId: {
            $ref: '#/components/schemas/electionId'
          },
          name: {
            $ref: '#/components/schemas/name'
          },
          description: {
            $ref: '#/components/schemas/description'
          },
          organisation: {
            $ref: '#/components/schemas/organisation'
          },
          votersNumber: {
            $ref: '#/components/schemas/votersNumber'
          },
          votes: {
            $ref: '#/components/schemas/votes'
          },
          candidacy_startDate: {
            $ref: '#/components/schemas/candidacy_startDate'
          },
          candidacy_endDate: {
            $ref: '#/components/schemas/candidacy_endDate'
          },
          voting_startDate: {
            $ref: '#/components/schemas/voting_startDate'
          },
          voting_endDate: {
            $ref: '#/components/schemas/voting_endDate'
          },
          state: {
            $ref: '#/components/schemas/state'
          },
          type: {
            $ref: '#/components/schemas/type'
          }
        }
      },
      Elections: {
        type: 'object',
        properties: {
          users: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Election'
            }
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string'
          },
          internal_code: {
            type: 'string'
          }
        }
      }
    },
    responses: {
      UnauthorizedError: {
        description: 'Access token is missing or invalid'
      },
      UnauthenticatedError: {
        description: 'Not authenticated'
      }
    }
  } 
};
module.exports = openApiDoc;