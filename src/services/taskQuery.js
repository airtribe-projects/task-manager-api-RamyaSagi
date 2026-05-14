const parseCompletedQuery = (raw) => {
  if (raw === undefined || raw === null || raw === "") {
    return { skip: true };
  }

  const normalized = String(raw).trim().toLowerCase();
  if (normalized === "true") {
    return { value: true };
  }
  if (normalized === "false") {
    return { value: false };
  }

  return {
    error: "Query parameter completed must be true or false",
  };
};

const parseOrderQuery = (raw) => {
  const normalized = String(raw ?? "asc").trim().toLowerCase();
  if (normalized === "asc" || normalized === "desc") {
    return { order: normalized };
  }
  return { error: "Query parameter order must be asc or desc" };
};

const compareByCreatedAt = (a, b, order) => {
  const ta = new Date(a.createdAt).getTime();
  const tb = new Date(b.createdAt).getTime();
  if (ta !== tb) {
    return order === "asc" ? ta - tb : tb - ta;
  }
  return a.id - b.id;
};

const filterAndSortTasks = (taskList, query) => {
  const completedResult = parseCompletedQuery(query.completed);
  if (completedResult.error) {
    return { validationErrors: [completedResult.error] };
  }

  const orderResult = parseOrderQuery(query.order);
  if (orderResult.error) {
    return { validationErrors: [orderResult.error] };
  }

  let list = [...taskList];
  if (!completedResult.skip) {
    list = list.filter((task) => task.completed === completedResult.value);
  }

  list.sort((a, b) => compareByCreatedAt(a, b, orderResult.order));

  return { tasks: list };
};

module.exports = {
  filterAndSortTasks,
};
