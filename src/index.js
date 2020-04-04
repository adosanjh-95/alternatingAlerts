const app = require("./server");
const { PORT } = require("../config");

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
