const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = require("graphql");

// Mongose Model
const Project = require('../models/projectModel')
const Client = require('../models/clientModel')

// Define the project fields
const projectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: { type: clientType,
    resolve(parent, args) {
      return Client.findById(parent.clientId)
    }
    },
  }),
});

// Define the client fields
const clientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

// Querries
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // Query to get list of projects
    projects: {
      type: new GraphQLList(projectType),
      resolve(parent, args) {
        return Project.find();
      },
    },
    // Query to get a project
    project: {
      type: projectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Project.findById(args.id);
      },
    },
    // Query to get list of clients
    clients: {
      type: new GraphQLList(clientType),
      resolve(parent, args) {
        return Client.find();
      },
    },
    // Query to get a client
    client: {
      type: clientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Client.findById(args.id);
      },
    },
  },
});


// Mutation


module.exports = new GraphQLSchema({
  query: RootQuery,
});
