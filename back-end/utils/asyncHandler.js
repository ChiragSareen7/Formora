//The asyncHandler function is a HOF that simplifies error handling in Express.js by wrapping asynchronous route handlers in a try-catch block, ensuring consistent and clean error responses. Know more at : https://docs.google.com/document/d/1eBt2_bT8PuNKseR8iq5W3SGqwEU7CIsKnRjKvjB-NRQ/edit?usp=sharing

const asyncHandler = (fn) => async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      res.status(error.code ? error.code : 500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  export { asyncHandler };