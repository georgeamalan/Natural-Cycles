export type LabelDictionary = {
  readonly [key: string]: string | LabelDictionary
}

export type LabelKey<T> = T extends string
  ? ''
  : T extends Record<string, unknown>
    ? {
        [K in keyof T & string]: LabelKey<T[K]> extends infer R
          ? R extends never
            ? never
            : R extends ''
              ? K
              : `${K}.${R & string}`
          : never
      }[keyof T & string]
    : never
