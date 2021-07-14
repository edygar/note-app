import db from "../../db.server";
import {
  ActionFunction,
  Link,
  LoaderFunction,
  redirect,
  useRouteData,
} from "remix";
import { Outlet, useHref, useLocation } from "react-router-dom";

export let loader: LoaderFunction = async ({ params: { id } }) => {
  const [note] = db.notes.findAll((note) => note.id === id) || false;
  if (!note) return redirect("/notes");

  return note;
};

export const action: ActionFunction = async ({ params: { id }, request }) => {
  const formData = new URLSearchParams(await request.text());
  db.notes.edit(id, Object.fromEntries(formData.entries()));

  return `/notes/${id}`;
};

export default function Index() {
  const note = useRouteData();
  const { pathname } = useLocation();

  return (
    <article
      style={{ textAlign: "center", padding: 20 }}
    >
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
