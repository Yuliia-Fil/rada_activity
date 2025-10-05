import app from "./app.js";
import { PORT, BASE_URL } from "./constants/constants.js";

app.listen(PORT, () => {
  console.log(`✅ Server is running on ${BASE_URL}`);
});
