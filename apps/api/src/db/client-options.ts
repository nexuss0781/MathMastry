/**
 * Connection options shared by the app pool and one-off scripts.
 *
 * Wasmer's managed Postgres is reachable over TLS with a private CA, so the
 * certificate cannot be verified from inside the app. Local development runs
 * plain TCP and must not force TLS.
 */
export function databaseOptions(url: string) {
  const local = /(^|[/@])(localhost|127\.0\.0\.1|::1)([:/]|$)/.test(url);
  const sslDisabled = /[?&]sslmode=disable(&|$)/.test(url);
  return {
    max: 3,
    prepare: false,
    connect_timeout: 15,
    idle_timeout: 20,
    ...(local || sslDisabled ? {} : { ssl: { rejectUnauthorized: false } }),
  } as const;
}
