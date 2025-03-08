export const getAllMailTemplateIdentifier = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_APP_NM_BACKEND_USER_URL}/template/get-all`,
    {
      method: "GET",
      headers: {
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    }
  );
  console.log(response);
  return response;
};
