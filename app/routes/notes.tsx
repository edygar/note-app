import db, { Note } from "../db.server";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Form,
  MetaFunction,
  LinksFunction,
  LoaderFunction,
  useRouteData,
  ActionFunction,
  usePendingFormSubmit,
} from "remix";

import stylesUrl from "../styles/index.css";

export const meta: MetaFunction = () => {
  return {
    title: "Notes",
    description: "List all notes",
  };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());

  const note = db.notes.create({
    title: formData.get("title") || "",
  });

  return `/notes/${note.id}`;
};

export const loader: LoaderFunction = async () => {
  return db.notes.findAll();
};

export default function Index() {
  const { pathname } = useLocation();
  const notes: Note[] = useRouteData();
  const pending = usePendingFormSubmit();

  return (
    <div style={{ display: "grid", grid: `"aside content" 1fr / auto 1fr` }}>
      <aside>
        <h1>Notes</h1>
        <ul>
          <li>
            <Form action="/notes" method="post">
              <fieldset disabled={pending && pending.action.endsWith(pathname)}>
                <input
                  required
                  key={notes.length}
                  autoFocus={!!pathname.match(/\/notes\/?(\w+\/?)?$/)}
                  name="title"
                />
                <button className="">Add</button>
              </fieldset>
            </Form>{" "}
          </li>
          {notes.map(({ id, title }) => (
            <li key={id}>
              <Link to={`${id}`}>{title}</Link>
            </li>
          )).reverse()}
        </ul>
      </aside>

      <Outlet />
    </div>
  );
}
