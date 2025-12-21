// Conversation state manager (placeholder)
// Will be expanded with persistence and memory later

const stateStore = new Map();

export const getConversationState = async (sessionId) => {
  return stateStore.get(sessionId) || {
    sessionId,
    history: [],
    level: "beginner"
  };
};

export const updateConversationState = async (sessionId, message) => {
  const current = stateStore.get(sessionId) || {
    sessionId,
    history: [],
    level: "beginner"
  };

  current.history.push(message);
  stateStore.set(sessionId, current);

  return current;
};
