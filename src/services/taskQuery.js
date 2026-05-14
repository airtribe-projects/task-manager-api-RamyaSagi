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

/**
 * Returns a finite millisecond timestamp for sorting.
 * Missing, empty, or invalid createdAt values sort as 0 (epoch), i.e. oldest first when ascending.
 */
const getCreatedAtSortTime = (task) => {
  if (task === null || task === undefined || typeof task !== "object") {
    return 0;
  }

  const raw = task.createdAt;
  if (raw === undefined || raw === null || raw === "") {
    return 0;
  }

  const time = new Date(raw).getTime();
  return Number.isFinite(time) ? time : 0;
};

const compareByCreatedAt = (a, b, order) => {
  const ta = getCreatedAtSortTime(a);
  const tb = getCreatedAtSortTime(b);
  if (ta !== tb) {
    return order === "asc" ? ta - tb : tb - ta;
  }
  return a.id - b.id;
};

/**
 * Safe read of completion flag. Nullish / non-object tasks or non-boolean completed
 * are treated as not completed (false) so filtering never throws.
 */
const isTaskCompleted = (task) => {
  if (task === null || task === undefined || typeof task !== "object") {
    return false;
  }
  return task.completed === true;
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
    list = list.filter((task) => isTaskCompleted(task) === completedResult.value);
  }

  list.sort((a, b) => compareByCreatedAt(a, b, orderResult.order));

  return { tasks: list };
};

module.exports = {
  filterAndSortTasks,
};
