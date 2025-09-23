module.exports = {
  apps: [
    {
      name: "Backend",
      script: "./app.js",
      cwd: "./Backend",
      watch: true,
    },
    {
      name: "Frontend",
      script: "npm",
      args: "run dev",
      cwd: "./Frontend",
      watch: false,
    },
  ],
};