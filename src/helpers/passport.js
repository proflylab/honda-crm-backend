import jwt from 'jsonwebtoken'

export default {
  isAuthenticated: (req, res, next) => {
    const excludedUrls = [
      { method: 'GET', path: '/' },
      { method: 'POST', path: '/api/v1/user/login' },
      { method: 'GET', path: '/api/v1/user/generate' }
    ] // URLs to exclude from JWT expiration check

    const isExcludedUrl = excludedUrls.some(
      (url) => url.method === req.method && url.path === req.path
    )

    if (isExcludedUrl) {
      // Skip JWT expiration check for excluded URLs
      req.user = null // Set req.user to null or any default value for excluded URLs
      return next()
    }

    const authorization = req.headers.authorization // Assuming the token is passed in the Authorization header
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ status: 401, message: 'No token provided' })
    }

    const token = authorization.substring(7) // Remove "Bearer " prefix

    // Verify the JWT and check the expiration
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res
            .status(401)
            .json({ status: 401, message: 'Token has expired' })
        } else {
          return res.status(403).json({ status: 403, message: 'Invalid token' })
        }
      }

      // If the token is valid, you can access the decoded token data in `decodedToken`
      req.user = decodedToken // Optionally, store the decoded token data in the `req` object
      next()
    })
  },
  isAdmin: (req, res, next) => {
    if (req.user.role === 'admin') {
      next() // User has admin role, proceed to the next middleware
    } else {
      res.status(403).json({ status: 403, message: 'Unauthorized' })
    }
  }
}
