let callCount = 0;

const doSomeHeavyTask = () => {
  callCount++;
  const start = Date.now();
  // Simulate a heavy task
  for (let i = 0; i < 1e8; i++) {}
  const end = Date.now();
  if (callCount > 8) {
    throw new Error("Task failed due to heavy load");
  }
  return end - start; // time taken in milliseconds
};

module.exports = {
  doSomeHeavyTask,
};
