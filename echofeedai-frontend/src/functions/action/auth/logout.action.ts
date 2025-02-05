import { getUserSession } from "@/services/sessions.server";
import { redirect } from "react-router-dom";

export async function action() {
  const session = getUserSession();
  session.removeUser();
  // make a request to the backend to logout
  const url = import.meta.env.VITE_APP_USER_BACKEND_USER_URL_LOGOUT;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
  });
  if (!response.ok) {
    throw new Error("Failed to logout");
  }
  const data = await response.json();
  console.log(data);

  return redirect("/");
}
