module.exports = {
  definition: /* GraphQL */ `
    extend type UsersPermissionsMe {
      problems: [Problem]
      problemsByDifficulty: JSON
      problemsByGroup: JSON
    }
  `,
  mutation: `
    addProblem(email: String!, problemId: ID!): UsersPermissionsMe
  `,
  resolver: {
    Mutation: {
      addProblem: {
        description: "Update completed problems of existing user",
        resolverOf: "plugins::users-permissions.user.addProblem",
        resolver: async (obj, { email, problemId }, { context }) => {
          const user = await strapi.plugins[
            "users-permissions"
          ].controllers.user.addProblem(email, problemId);

          return user;
        },
      },
    },
  },
};
