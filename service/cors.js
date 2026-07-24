const cors = require("cors");

app.use(
  cors({
    origin: "https://upgraded-guide-r4qvwxr59jprcxr97-8080.app.github.dev/", //frontend URL
    credentials: true,
  })
);