import db from "../../../db.server";
import {
  Form,
  LoaderFunction,
  redirect,
  usePendingFormSubmit,
  useRouteData,
} from "remix";
import { useHref } from "react-router-dom";

export let loader: LoaderFunction = async ({ params: { id } }) => {
  const [note] = db.notes.findAll((note) => note.id === id) || false;
  if (!note) return redirect("/notes");

  return note;
};

export default function Index() {
  const action = useHref("..");
  const note = useRouteData();
  const pending = usePendingFormSubmit();

  return (
    <article style={{ textAlign: "center", padding: 20 }}>
      <Form method="post" action={action}>
        <fieldset disabled={pending && pending.action.endsWith(action)}>
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
