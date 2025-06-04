(function () {
  "use strict";

  // Logger utility for controlled console output
  window.Logger = {
    // Determine if we're in development mode
    isDevelopment: function () {
      // Check for localhost
      return (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      );
    },

    // Log error messages
    error: function (message, data) {
      if (Logger.isDevelopment()) {
        console.error(message, data || "");
      }
    },

    // Log warning messages
    warn: function (message, data) {
      if (Logger.isDevelopment()) {
        console.warn(message, data || "");
      }
    },

    // Log info messages
    info: function (message, data) {
      if (Logger.isDevelopment()) {
        console.info(message, data || "");
      }
    },

    // Log debug messages (only in development)
    debug: function (message, data) {
      if (Logger.isDevelopment()) {
        console.log("[DEBUG]", message, data || "");
      }
    },

    // Group related logs
    group: function (label) {
      if (Logger.isDevelopment() && console.group) {
        console.group(label);
      }
    },

    // End log group
    groupEnd: function () {
      if (Logger.isDevelopment() && console.groupEnd) {
        console.groupEnd();
      }
    },

    // Log performance metrics
    time: function (label) {
      if (Logger.isDevelopment() && console.time) {
        console.time(label);
      }
    },

    // End performance timing
    timeEnd: function (label) {
      if (Logger.isDevelopment() && console.timeEnd) {
        console.timeEnd(label);
      }
    },
  };
})();
