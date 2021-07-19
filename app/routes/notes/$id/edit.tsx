import db, { Note } from "../../../services/db";
import {
  Form,
  LoaderFunction,
  redirect,
  usePendingFormSubmit,
  useRouteData,
} from "remix";
import { useHref } from "react-router-dom";
import { withSession } from "../../../services/sessionStorage";

export let loader: LoaderFunction = async ({ request, params: { id } }) =>
  withSession(request, async (session) => {
    const [note] = db.notes.findAll((note) => note.id === id) || false;
    if (!note) return redirect("/notes");

    return { note, errors: session.get("failedNoteEdit") };
  });

export default function Index() {
  const action = useHref("..");
  const { note, errors } =
    useRouteData<{ note: Note; errors?: [string, string][] }>();
  const pending = usePendingFormSubmit();

  return (
    <article style={{ textAlign: "center", padding: 20 }}>
      <Form method="post" action={action}>
        <fieldset disabled={pending && pending.action.endsWith(action)}>
          {errors &&
            errors.map(([field, message]) => (
              <p key={field + message}>{message}</p>
            ))}
          <p>
            <input
              required
              placeholder="title"
              name="title"
              defaultValue={note.title}
              autoFocus
            />
          </p>
          <p>
            <textarea
              placeholder="content"
              rows={10}
              name="content"
              defaultValue={note.content}
            />
          </p>
          <button>save</button>
        </fieldset>
      </Form>
    </article>
  );
}
