class ServiceError extends Error {
  constructor(message, options = {}) {
    super(message, options);
    this.name = "ServiceError";
  }
}

module.exports = ServiceError;
