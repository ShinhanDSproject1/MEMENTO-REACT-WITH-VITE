export const mentosKeys = {
  all: ["mentos"] as const,
  list: (categoryId?: number, limit?: number, cursor?: number) =>
    ["mentos", "list", categoryId, limit, cursor] as const,
};
