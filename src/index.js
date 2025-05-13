import { initialize, sendIpxl, userClicks, userException } from "./core";
import { clearSession, getSessionId } from "./session";

export default {
  endSession: clearSession,
  getSessionId,
  initialize,
  sendIpxl,
  userClicks,
  userException,
};
