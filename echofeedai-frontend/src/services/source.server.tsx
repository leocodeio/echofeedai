import { FeedbackInitiativePayload } from "@/types/initiate";
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

// start ------------------------------ getParticipantByName ------------------------------
export const getParticipantByName = async (name: string) => {
  try {
    const participantUri = `${
      import.meta.env.VITE_APP_PARTICIPANT_BACKEND_USER_URL
    }/byName/${name}`;
    const participantResponse = await fetch(participantUri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
      },
      credentials: "include",
      mode: "cors",
    });

    return participantResponse;
  } catch (error) {
    console.error("Get participant error - source.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};

// start ------------------------------ addParticipantToSource ------------------------------
export const addParticipantToSource = async (
  sourceId: string,
  participantId: string
) => {
  try {
    const addParticipantUri = `${
      import.meta.env.VITE_APP_INITIATOR_BACKEND_USER_URL
    }/add-participant`;
    const addParticipantResponse = await fetch(addParticipantUri, {
      method: "POST",
      body: JSON.stringify({ sourceId, participantId }),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
      },
      credentials: "include",
      mode: "cors",
    });

    return addParticipantResponse;
  } catch (error) {
    console.error("Add participant error - source.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ addParticipantToSource ------------------------------

// start ------------------------------ getParticipants ------------------------------
export const getParticipants = async (sourceId: string) => {
  try {
    const participantsUri = `${
      import.meta.env.VITE_APP_INITIATOR_BACKEND_USER_URL
    }/source/participants/${sourceId}`;
    const participantsResponse = await fetch(participantsUri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
      },
      credentials: "include",
      mode: "cors",
    });

    return participantsResponse;
  } catch (error) {
    console.error("Get participants error - source.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ getParticipants ------------------------------

// start ------------------------------ getFeedbackInitiatives ------------------------------
export const getFeedbackInitiatives = async (sourceId: string) => {
  try {
    const feedbackInitiatorsUri = `${
      import.meta.env.VITE_APP_INITIATOR_BACKEND_USER_URL
    }/feedback-initiates/${sourceId}`;
    const feedbackInitiatorsResponse = await fetch(feedbackInitiatorsUri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
      },
      credentials: "include",
      mode: "cors",
    });

    return feedbackInitiatorsResponse;
  } catch (error) {
    console.error("Get feedback initiators error - source.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ getFeedbackInitiatives ------------------------------

// start ------------------------------ deleteFeedbackInitiate ------------------------------
export const deleteFeedbackInitiate = async (id: string) => {
  try {
    const deleteFeedbackInitiateUri = `${
      import.meta.env.VITE_APP_INITIATOR_BACKEND_USER_URL
    }/delete-feedback-initiate/${id}`;
    const deleteFeedbackInitiateResponse = await fetch(
      deleteFeedbackInitiateUri,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_APP_API_KEY,
        },
        credentials: "include",
        mode: "cors",
      }
    );

    return deleteFeedbackInitiateResponse;
  } catch (error) {
    console.error("Delete feedback initiate error - source.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ deleteFeedbackInitiate ------------------------------
// start ------------------------------ createFeedbackInitiative ------------------------------
export const createFeedbackInitiative = async (
  feedbackInitiativePayload: FeedbackInitiativePayload
) => {
  try {
    const createFeedbackInitiativeUri = `${
      import.meta.env.VITE_APP_INITIATOR_BACKEND_USER_URL
    }/initiate-feedback`;
    const createFeedbackInitiativeResponse = await fetch(
      createFeedbackInitiativeUri,
      {
        method: "POST",
        body: JSON.stringify(feedbackInitiativePayload),
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_APP_API_KEY,
        },
        credentials: "include",
        mode: "cors",
      }
    );

    return createFeedbackInitiativeResponse;
  } catch (error) {
    console.error(
      "Create feedback initiative error - source.server.tsx",
      error
    );
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ createFeedbackInitiative ------------------------------
