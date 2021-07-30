import { withSession } from "../services/sessionStorage";
import db, { Note } from "../services/db";
import { Link, Outlet, useLocation, useMatch, useHref } from "react-router-dom";
import {
  Form,
  MetaFunction,
  LoaderFunction,
  useRouteData,
  ActionFunction,
  usePendingFormSubmit,
  redirect,
} from "remix";

export const meta: MetaFunction = () => {
  return {
    title: "Notes",
    description: "List all notes",
  };
};

export const action: ActionFunction = async ({ request }) =>
  withSession(request, async (session) => {
    const formData = new URLSearchParams(await request.text());

    try {
      const note = db.notes.create({
        title: formData.get("title"),
      });

      return redirect(`/notes/${note.id}`);
    } catch (exception) {
      if (!("name" in exception) || exception.name !== "ValidationException") {
        throw exception;
      }

      session.flash("listItemNoteCreationErrors", exception.errors);
    }

    const { pathname, search } = new URL(request.url);
    return pathname + search;
  });

export const loader: LoaderFunction = async ({ request }) =>
  withSession(request, (session) => ({
    notes: db.notes.findAll(),
    errors: session.get("listItemNoteCreationErrors"),
  }));

export default function Notes() {
  const { pathname } = useLocation();
  const currentPath = useHref(".");

  const { notes = [], errors } =
    useRouteData<{ notes: Note[]; errors: string[] }>();
  const pending = usePendingFormSubmit();

  return (
    <div style={{ display: "grid", grid: `"aside content" 1fr / auto 1fr` }}>
      <aside>
        <h1>Notes</h1>
        <ul>
          <li>
            <Form action={currentPath} method="post">
              <fieldset
                disabled={pending && pending.action.endsWith(currentPath)}
              >
                <input
                  required
                  key={notes.length}
                  autoFocus={pathname.endsWith(currentPath)}
                  name="title"
                />
                <button className="">Add</button>
                {errors &&
                  errors.map(([field, message]) => (
                    <p key={`${field}:${message}`}>{message}</p>
                  ))}
              </fieldset>
            </Form>
          </li>
          {notes
            .map(({ id, title }) => (
              <li key={id}>
                <Link to={`${id}`}>{title}</Link>
              </li>
            ))
            .reverse()}
        </ul>
      </aside>

      <Outlet />
    </div>
  );
}
