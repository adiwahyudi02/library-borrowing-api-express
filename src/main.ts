import { logger } from "./applications/logger";
import { web } from "./applications/web";

const port = process.env.PORT || 3000;

web.listen(port, () => {
  logger.info(`Listening on port ${port}`);
});
