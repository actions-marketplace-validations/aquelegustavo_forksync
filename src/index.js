const core = require("@actions/core");
const axios = require("axios");

try {
  let UPSTREAM_USER = core.getInput("UPSTREAM_USER", { required: true }),
    UPSTREAM_REPO = core.getInput("UPSTREAM_REPO", { required: true }),
    FORKED_USER = core.getInput("FORKED_USER", { required: true }),
    FORKED_REPO = core.getInput("FORKED_REPO", { required: true }),
    USER_TOKEN = core.getInput("USER_TOKEN", { required: true });

  core.startGroup("Do some function");
  console.log("Obtendo último commit do repositório original");
  core.endGroup();

  getLastCommit(UPSTREAM_USER, UPSTREAM_REPO, USER_TOKEN)
    .then((response) => {
      console.log(response.status);
      let sha = response.data.object.sha;
      console.log("SHA: ", sha);

      core.startGroup("Atualizando repositório fork");

      updateRepository(FORKED_USER, FORKED_REPO, USER_TOKEN, sha)
        .then((response) => {
          console.log(response.status);
          console.log("DATA: ", response.data);
        })
        .catch((error) => {
          throw error;
        });
      core.endGroup();
    })
    .catch((error) => {
      throw error;
    });
} catch (error) {
  console.error(error.data);
  core.setFailed(`Action failed with error ${err}`);
}

function getLastCommit(user, repo, token) {
  let url = `https://api.github.com/repos/${user}/${repo}/git/refs/heads/main`;

  var config = {
    method: "get",
    url: url,
    headers: {
      Authorization: "Bearer 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",
    },
  };

  return axios(config);
}

function updateRepository(user, repo, token, sha) {
  let url = `https://api.github.com/repos/${user}/${repo}/git/refs/heads/main`;

  var data = JSON.stringify({
    sha: sha,
  });

  var config = {
    method: "patch",
    url: url,
    headers: {
      Authorization: "Bearer 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",
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config);
}
