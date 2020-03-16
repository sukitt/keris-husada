const customMiddleware = store => next => action => {
    console.log("========================================");
    console.log("Middleware triggered", action);
    console.log("========================================");
    console.log(store.getState())
    console.log("========================================");

    next(action)
}

export default customMiddleware;