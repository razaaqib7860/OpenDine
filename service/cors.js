

app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "https://fictional-cod-v697w5gjx6jqfxx69-8080.app.github.dev"
    ],
    credentials: true,
  })
);