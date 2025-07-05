export const validateUrl = (req, res, next) => {
  const { originalUrl } = req.body;
  
  if (!originalUrl || typeof originalUrl !== 'string') {
    return res.status(400).json({ error: "Valid URL is required" });
  }
  
  const urlRegex = /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if (!urlRegex.test(originalUrl)) {
    return res.status(400).json({ error: "Invalid URL format" });
  }
  
  next();
};

export const validateAuth = (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Valid email is required" });
  }
  
  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }
  
  if (req.path === '/signup') {
    if (!firstName || firstName.trim().length < 1) {
      return res.status(400).json({ error: "First name is required" });
    }
    if (!lastName || lastName.trim().length < 1) {
      return res.status(400).json({ error: "Last name is required" });
    }
  }
  
  next();
};

export const validateUserId = (req, res, next) => {
  const { userId } = req.params;
  
  if (!userId || !/^[a-fA-F0-9]{24}$/.test(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  
  next();
};