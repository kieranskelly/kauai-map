import { redirect } from "next/navigation";

// The photoreal scene was promoted to the home route (/). Keep this path as a
// permanent redirect so old links/bookmarks still land on the map.
export default function PhotorealRedirect() {
  redirect("/");
}
