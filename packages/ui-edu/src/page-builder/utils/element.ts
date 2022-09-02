export const getParentId = (id: string) => {
  return id.split('.').slice(0, -2).join('.');
};

export const getNextId = (id: string) =>
  id.replace(/([^.].*\.)(.*)/g, (_, parent, childId) => {
    return parent + (parseInt(childId) + 1);
  });
