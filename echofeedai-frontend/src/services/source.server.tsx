import { SourcePayload } from "@/types/source";
// start ------------------------------ getSources ------------------------------
export const getSources = async () => {
  try {
    const sourcesUri = `${
      import.meta.env.VITE_APP_INITIATOR_BACKEND_USER_URL
    }/sources`;
    const sourcesResponse = await fetch(sourcesUri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
      },
      credentials: "include",
      mode: "cors",
    });

    return sourcesResponse;
  } catch (error) {
    console.error("Get sources error - source.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ getSources ------------------------------

// start ------------------------------ getSource ------------------------------
export const getSource = async (id: string) => {
  try {
    const sourceUri = `${
      import.meta.env.VITE_APP_INITIATOR_BACKEND_USER_URL
    }/source/${id}`;
    const sourceResponse = await fetch(sourceUri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
      },
      credentials: "include",
      mode: "cors",
    });
    // console.log("sourceResponse", sourceResponse);

    return sourceResponse;
  } catch (error) {
    console.error("Get source error - source.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ getSource ------------------------------

// start ------------------------------ createSource ------------------------------
export const createSource = async (sourcePayload: SourcePayload) => {
  try {
    const createSourceUri = `${
      import.meta.env.VITE_APP_INITIATOR_BACKEND_USER_URL
    }/add-source`;
    const createSourceResponse = await fetch(createSourceUri, {
      method: "POST",
      body: JSON.stringify(sourcePayload),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
      },
      credentials: "include",
      mode: "cors",
    });

    return createSourceResponse;
  } catch (error) {
    console.error("Create source error - source.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ createSource ------------------------------

// start ------------------------------ updateSource ------------------------------
export const updateSource = async (
  id: string,
  sourcePayload: SourcePayload
) => {
  try {
    const updateSourceUri = `${
      import.meta.env.VITE_APP_INITIATOR_BACKEND_USER_URL
    }/update-source/${id}`;
    const updateSourceResponse = await fetch(updateSourceUri, {
      method: "PUT",
      body: JSON.stringify(sourcePayload),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
      },
      credentials: "include",
      mode: "cors",
    });

    return updateSourceResponse;
  } catch (error) {
    console.error("Update source error - source.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ updateSource ------------------------------

// start ------------------------------ deleteSource ------------------------------
export const deleteSource = async (id: string) => {
  try {
    const deleteSourceUri = `${
      import.meta.env.VITE_APP_INITIATOR_BACKEND_USER_URL
    }/delete-source/${id}`;
    const deleteSourceResponse = await fetch(deleteSourceUri, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
      },
      credentials: "include",
      mode: "cors",
    });

    return deleteSourceResponse;
  } catch (error) {
    console.error("Delete source error - source.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ deleteSource ------------------------------
