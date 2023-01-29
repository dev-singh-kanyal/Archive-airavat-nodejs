module.exports = {
    dbName: process.env.DB_NAME || 'iocldb',
    driverAuthExpire: parseInt(process.env.DRIVER_AUTH_EXPIRE) || 3,
    userAuthExpire: parseInt(process.env.USER_AUTH_EXPIRE) || 3
}
