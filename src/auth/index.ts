import { Request } from "restify";
import { userService } from "../services/user";

export async function getAuthorizedUserId(req: Request) {
  if (req && req.headers && req.headers.authorization) {
    const token = req.headers.authorization;
    const users = await userService.list();
    const authorizedUser = users.find(user => token.includes(user.accessToken));
    if (authorizedUser) {
      return authorizedUser.id;
    } else {
      throw new Error("invalid authentication token");
    }
  } else {
    throw new Error("missing authentication token");
  }
}
