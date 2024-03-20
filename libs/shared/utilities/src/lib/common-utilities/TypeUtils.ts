export type TypedKeys<T> = (keyof T extends infer U
  ? U extends string
    ? U
    : U extends number
    ? `${U}`
    : never
  : never)[];

const getTypedKeys = Object.keys as <T>(obj: T) => TypedKeys<T>;

export const TypeUtils = {
  getTypedKeys,
};
