import { LoaderFunction, redirect } from "remix";

export let loader: LoaderFunction = async () => {
  return redirect("/notes");
};

export default function Index() {return null}
