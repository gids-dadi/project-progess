const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");

// Mongose Model
const Project = require("../models/projectModel");
const Client = require("../models/clientModel");

// Define the project fields
const projectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: clientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId);
      },
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
const myMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // Mutation to add client
    addClient: {
      type: clientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        return client.save();
      },
    },
    // Mutation to delete client
    deleteClient: {
      type: clientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID)},
      },
      resolve(parent, args) {
        return Client.findByIdAndRemove(args.id)
      },
    },
    // Mutation to add a project
    addProject: {
      type: projectType,
      args: {
        name: {type: GraphQLNonNull(GraphQLString)},
        description: {type: GraphQLNonNull(GraphQLString)},
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatus',
            'new': { value: 'Not Started'},
            'started': { value: 'In progrss'},
            'ended': { value: 'completed'},
          }),
          defaultValue: 'new'

        },
        clientId: {type: GraphQLNonNull(GraphQLID)}
      }

    }
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: myMutation,
});
