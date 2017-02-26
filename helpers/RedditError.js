module.exports = class RedditError extends Error {
    constructor(name, message, code, fileName, lineNumber) {
        super(message, fileName, lineNumber);
        this.name = name;
        this.code = code || 500;
    }
};
