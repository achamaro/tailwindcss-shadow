export function newInstance<
  T extends object,
  U extends unknown[] = T extends InstanceType<infer C>
    ? ConstructorParameters<C>
    : never
>(instance: T, ...args: U): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new (<any>instance.constructor)(...args);
}
