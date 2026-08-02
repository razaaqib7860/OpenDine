function renderError(req, res) {
    const statusCode = res.statusCode || 500;

    const errors = {
        401: {
            title: "Authentication Required",
            message: "Please sign in to continue."
        },
        403: {
            title: "Access Denied",
            message: "You don't have permission to access this page."
        },
        404: {
            title: "Page Not Found",
            message: "The page you are looking for doesn't exist."
        },
        500: {
            title: "Internal Server Error",
            message: "Something went wrong on our side."
        },
        503: {
            title: "Service Unavailable",
            message: "Please try again in a few moments."
        }
    };

    const error = errors[statusCode] || errors[500];

    res.render("error", {
        statusCode,
        title: error.title,
        message: error.message
    });
}

module.exports = {
    renderError
};