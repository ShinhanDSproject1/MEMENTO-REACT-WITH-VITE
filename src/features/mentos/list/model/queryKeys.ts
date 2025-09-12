export const mentosKeys = {
  all: ["mentos"] as const,
  list: (category: string | undefined) => [...mentosKeys.all, "list", category] as const,
};
