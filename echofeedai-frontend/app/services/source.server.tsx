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
// start ------------------------------ getFeedbackInitiative ------------------------------
export const getFeedbackInitiative = async (id: string) => {
  try {
    const feedbackInitiativeUri = `${
      import.meta.env.VITE_APP_INITIATOR_BACKEND_USER_URL
    }/feedback-initiate/${id}`;
    const feedbackInitiativeResponse = await fetch(feedbackInitiativeUri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
      },
      credentials: "include",
      mode: "cors",
    });

    return feedbackInitiativeResponse;
  } catch (error) {
    console.error("Get feedback initiate error - source.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ getFeedbackInitiative ------------------------------
// start ------------------------------ getTopics ------------------------------
export const getTopics = async () => {
  try {
    const topicsUri = `${
      import.meta.env.VITE_APP_INITIATOR_BACKEND_USER_URL
    }/topics`;
    const topicsResponse = await fetch(topicsUri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
      },
      credentials: "include",
      mode: "cors",
    });

    return topicsResponse;
  } catch (error) {
    console.error("Get topics error - source.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ getTopics ------------------------------
// start ------------------------------ getParticipantById ------------------------------
export const getParticipantById = async (id: string) => {
  try {
    const participantUri = `${
      import.meta.env.VITE_APP_PARTICIPANT_BACKEND_USER_URL
    }/byId/${id}`;
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
    console.error("Get participant by id error - source.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ getParticipantById ------------------------------
// start ------------------------------ canRespond ------------------------------
export const canRespond = async (feedbackInitiateId: string) => {
  try {
    const canRespondUri = `${
      import.meta.env.VITE_APP_PARTICIPANT_BACKEND_USER_URL
    }/can-respond/${feedbackInitiateId}`;
    const canRespondResponse = await fetch(canRespondUri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
      },
      credentials: "include",
      mode: "cors",
    });
    console.log("canRespondResponse", canRespondResponse);
    return canRespondResponse;
  } catch (error) {
    console.error("Can respond error - source.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ canRespond ------------------------------
// start ------------------------------ addFeedbackResponse ------------------------------
export const addFeedbackResponse = async (
  feedbackInitiateId: string,
  response: string
) => {
  try {
    const addFeedbackResponseUri = `${
      import.meta.env.VITE_APP_PARTICIPANT_BACKEND_USER_URL
    }/add-response/${feedbackInitiateId}`;
    const addFeedbackResponseResponse = await fetch(addFeedbackResponseUri, {
      method: "POST",
      body: JSON.stringify({ response }),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
      },
      credentials: "include",
      mode: "cors",
    });

    return addFeedbackResponseResponse;
  } catch (error) {
    console.error("Add feedback response error - source.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ addFeedbackResponse ------------------------------
// start ------------------------------ getFeedbackResponse ------------------------------
export const getFeedbackResponse = async (feedbackInitiateId: string) => {
  try {
    const getFeedbackResponseUri = `${
      import.meta.env.VITE_APP_INITIATOR_BACKEND_USER_URL
    }/get-response/${feedbackInitiateId}`;
    const getFeedbackResponseResponse = await fetch(getFeedbackResponseUri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
      },
      credentials: "include",
      mode: "cors",
    });
    console.log("getFeedbackResponseResponse", getFeedbackResponseResponse);

    return getFeedbackResponseResponse;
  } catch (error) {
    console.error("Get feedback response error - source.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ getFeedbackResponse ------------------------------
