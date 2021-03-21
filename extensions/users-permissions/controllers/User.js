module.exports = {
  async addProblem(email, problemId) {
    try {
      const user = await strapi.plugins[
        "users-permissions"
      ].services.user.fetch({
        email,
      });

      const problem = await strapi.services.problem.findOne({ id: problemId });

      const problemsBefore = user.problems;

      const problemsByDifficultyBefore = user.problemsByDifficulty || {
        easy: {
          _total: 0,
        },
        medium: {
          _total: 0,
        },
        hard: {
          _total: 0,
        },
        very_hard: {
          _total: 0,
        },
      };
      const problemsByGroupBefore = user.problemsByGroup || {
        Array: {
          _total: 0,
        },
        Binary: {
          _total: 0,
        },
        "Binary Search": {
          _total: 0,
        },
        "Binary Search Tree": {
          _total: 0,
        },
        "Binary Tree": {
          _total: 0,
        },
        "Dynamic Programming": {
          _total: 0,
        },
        Graph: {
          _total: 0,
        },
        "Hash Table": {
          _total: 0,
        },
        Heap: {
          _total: 0,
        },
        Interval: {
          _total: 0,
        },
        "Linked List": {
          _total: 0,
        },
        Matrix: {
          _total: 0,
        },
        Stack: {
          _total: 0,
        },
        String: {
          _total: 0,
        },
        Trie: {
          _total: 0,
        },
      };

      const isNotSolvedBefore = !problemsBefore.some(
        (p) => p.id === problem.id
      );

      if (isNotSolvedBefore) {
        problemsBefore.push(problem.id);

        problemsByDifficultyBefore[problem.difficulty][problem.id] = true;
        problemsByDifficultyBefore[problem.difficulty]._total += 1;

        problemsByGroupBefore[problem.group.tag][problem.id] = true;
        problemsByGroupBefore[problem.group.tag]._total += 1;
      }

      const queue = [
        { problemsByDifficulty: problemsByDifficultyBefore },
        { problemsByGroup: problemsByGroupBefore },
        { problems: problemsBefore },
      ];

      while (queue.length > 0) {
        const update = queue.shift();

        await strapi
          .query("user", "users-permissions")
          .update({ id: user.id }, update);
      }

      return user;
    } catch (err) {
      console.log(err);
    }
  },
};
