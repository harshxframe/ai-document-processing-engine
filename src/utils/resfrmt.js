export function resfrmt(
  error = true,
  code = 500,
  message = "Server Error",
  data = {},
) {
  return {
    error: error,
    code: code,
    message: message,
    data: data,
    timeStamp: new Date().toISOString(),
  };
}
