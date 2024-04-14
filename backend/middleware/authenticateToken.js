import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log("Received token:", token);

    if (token == null) {
        console.log("Aucun token fourni");
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log("JWT Error:", err);
            return res.sendStatus(403);
        }
        req.userId = user.userId;
        next();
    });
};  