export const notNil = (input: string | undefined) => (input?.trim()?.length || 0) > 0;
