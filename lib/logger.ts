// Purpose: Simple logging utility for debugging

/**
 * Log levels in order of severity
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4, // Use this to disable logging
}

// Current log level - change this to adjust what gets logged
// In production, you might want to set this to WARN or ERROR
let currentLogLevel = LogLevel.DEBUG;

// Enable/disable colorful console output
const useColors = true;

// Colors for different log levels
const colors = {
  debug: '#7986CB', // Light blue
  info: '#4CAF50',  // Green
  warn: '#FFC107',  // Yellow/amber
  error: '#F44336', // Red
};

/**
 * Set the current log level
 * 
 * @param level - The log level to set
 */
export function setLogLevel(level: LogLevel): void {
  currentLogLevel = level;
  logger.info(`Log level set to ${LogLevel[level]}`);
}

/**
 * Format log messages with consistent style and additional context
 * 
 * @param level - Log level string
 * @param message - The message to log
 * @param optionalParams - Additional parameters to log
 * @returns Formatted string and params to log
 */
function formatLog(level: string, message: string, optionalParams: any[]): [string, any[]] {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
  
  return [formattedMessage, optionalParams];
}

/**
 * Main logger object with methods for each log level
 */
export const logger = {
  /**
   * Log debug message - for detailed information during development
   * 
   * @param message - The message to log
   * @param optionalParams - Additional parameters to log
   */
  debug(message: string, ...optionalParams: any[]): void {
    if (currentLogLevel <= LogLevel.DEBUG) {
      const [formattedMessage, params] = formatLog('debug', message, optionalParams);
      if (useColors && typeof window !== 'undefined') {
        console.log(`%c${formattedMessage}`, `color: ${colors.debug}`, ...params);
      } else {
        console.log(formattedMessage, ...params);
      }
    }
  },

  /**
   * Log info message - for general information about application flow
   * 
   * @param message - The message to log
   * @param optionalParams - Additional parameters to log
   */
  info(message: string, ...optionalParams: any[]): void {
    if (currentLogLevel <= LogLevel.INFO) {
      const [formattedMessage, params] = formatLog('info', message, optionalParams);
      if (useColors && typeof window !== 'undefined') {
        console.log(`%c${formattedMessage}`, `color: ${colors.info}`, ...params);
      } else {
        console.log(formattedMessage, ...params);
      }
    }
  },

  /**
   * Log warning message - for potential issues that aren't errors
   * 
   * @param message - The message to log
   * @param optionalParams - Additional parameters to log
   */
  warn(message: string, ...optionalParams: any[]): void {
    if (currentLogLevel <= LogLevel.WARN) {
      const [formattedMessage, params] = formatLog('warn', message, optionalParams);
      if (useColors && typeof window !== 'undefined') {
        console.warn(`%c${formattedMessage}`, `color: ${colors.warn}`, ...params);
      } else {
        console.warn(formattedMessage, ...params);
      }
    }
  },

  /**
   * Log error message - for actual errors that need attention
   * 
   * @param message - The message to log
   * @param optionalParams - Additional parameters to log
   */
  error(message: string, ...optionalParams: any[]): void {
    if (currentLogLevel <= LogLevel.ERROR) {
      const [formattedMessage, params] = formatLog('error', message, optionalParams);
      if (useColors && typeof window !== 'undefined') {
        console.error(`%c${formattedMessage}`, `color: ${colors.error}`, ...params);
      } else {
        console.error(formattedMessage, ...params);
      }
    }
  },

  /**
   * Log a group of related messages - useful for showing object details
   * 
   * @param label - Group label
   * @param callback - Function that contains console logs
   */
  group(label: string, callback: () => void): void {
    if (currentLogLevel < LogLevel.NONE) {
      console.group(label);
      callback();
      console.groupEnd();
    }
  },
};

// Helper to create a context-specific logger (for a specific component or feature)
export function createLogger(context: string) {
  return {
    debug: (message: string, ...params: any[]) => 
      logger.debug(`[${context}] ${message}`, ...params),
    info: (message: string, ...params: any[]) => 
      logger.info(`[${context}] ${message}`, ...params),
    warn: (message: string, ...params: any[]) => 
      logger.warn(`[${context}] ${message}`, ...params),
    error: (message: string, ...params: any[]) => 
      logger.error(`[${context}] ${message}`, ...params),
  };
}

// Default export for easier importing
export default logger;
