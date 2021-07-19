import db from "../../services/db";
import { withSession } from "../../services/sessionStorage";
import {
  ActionFunction,
  Link,
  LoaderFunction,
  redirect,
  useRouteData,
} from "remix";
import { Outlet, useLocation } from "react-router-dom";

export let loader: LoaderFunction = ({ params: { id } }) => {
  const [note] = db.notes.findAll((note) => note.id === id) || false;
  if (!note) return redirect("/notes");

  return note;
};

export const action: ActionFunction = async ({ request, params: { id } }) =>
  withSession(request, async (session) => {
    const formData = new URLSearchParams(await request.text());

    try {
      db.notes.edit(id, {
        title: formData.get("title"),
        content: formData.get("content"),
      });

      return redirect(`/notes/${id}`);
    } catch (exception) {
      if ("name" in exception && exception.name === "ValidationException") {
        session.flash("failedNoteEdit", exception.errors);
      }
    }
    return `/notes/${id}/edit`;
  });

export default function Index() {
  const note = useRouteData();
  const { pathname } = useLocation();

  return (
    <article style={{ textAlign: "center", padding: 20 }}>
      {pathname.match(/\/edit$/) ? (
        <Outlet />
      ) : (
        <>
          <h1>{note.title}</h1>
          <p style={{ whiteSpace: "pre-wrap" }}>{note.content}</p>
          <Link to="edit">Edit</Link>
        </>
      )}
    </article>
  );
}
