import {
  Request,
  Response,
  json,
  createCookieSessionStorage,
  LoaderFunction,
  Session,
  ActionFunction,
  redirect,
} from "remix";

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: { name: "PHPSESSID", path: "/" },
  });

export async function withSession(
  request: Request,
  handler: (session: Session) => ReturnType<LoaderFunction | ActionFunction>
) {
  let session = await getSession(request.headers.get("Cookie"));

  // pass the session to the loader/action and let it handle the response
  let response = await handler(session);

  // if they returned a plain object, turn it into a response
  if (!(response instanceof Response)) {
    if (typeof response === "string") {
      response = redirect(response);
    } else {
      response = json(response);
    }
  }

  // commit the session automatically
  response.headers.append("Set-Cookie", await commitSession(session));

  return response;
}
