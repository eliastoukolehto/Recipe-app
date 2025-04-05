export type Severity = 'error' | 'info' | 'success'

export interface Notification {
  message: string
  severity: Severity
}
